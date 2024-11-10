import path from "path";
import fs from "fs";
import { generateApi, ParsedRoute } from "swagger-typescript-api";
import { RouteConfig, ParameterConfig, Config, ProcedureConfig } from "./types";
import {
  ensureDirExists,
  convertToZodSchema,
  getSchemaName,
  camelCase,
} from "./helpers";
import { OpenAPIV2, OpenAPIV3 } from "openapi-types";
import { SchemaRegistry } from "./schema-registry";

function generateRouterFile(route: RouteConfig, routersDir: string) {
  const imports = new Set<string>([
    "import { z } from 'zod';",
    "import { router, publicProcedure, protectedProcedure } from '../trpc';",
    "import { TRPCError } from '@trpc/server';",
  ]);

  const procedures: string[] = [];

  route.procedures.forEach((proc) => {
    const inputSchema = buildInputSchema(proc);

    const procedureType =
      proc.type === "mutation" ? "protectedProcedure" : "publicProcedure";

    const apiCallArgs = generateApiCallArguments(proc);

    const procedure = `  ${normalizeRouteName(proc.name)}: ${procedureType}
    .input(${inputSchema})
    .${proc.type}(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.${route.namespace}.${camelCase(proc.name)}(${apiCallArgs});
        return response;
      } catch (error) {
        throw new TRPCError({
          code: '${getErrorCode(proc)}',
          message: ${getErrorMessage(proc)},
          cause: error,
        });
      }
    })`;

    procedures.push(procedure);
  });

  const routerContent = `${Array.from(imports).join("\n")}

export const ${route.name}Router = router({
${procedures.join(",\n\n")}
});`;

  fs.writeFileSync(path.resolve(routersDir, `${route.name}.ts`), routerContent);
}

function generateApiCallArguments(proc: ProcedureConfig): string {
  if (proc.type === "mutation") {
    return "{ ...input }";
  }

  const args: string[] = [];

  // Add path parameters
  proc.parameters?.forEach((param) => {
    if (param.type === "path") {
      args.push(`input.${param.name}`);
    }
  });

  // Add query parameters
  if (proc.parameters?.some((p) => p.type === "query")) {
    args.push("input.params");
  }

  return args.length ? args.join(", ") : "{}";
}

function collectUsedSchemas(proc: ProcedureConfig, usedSchemas: Set<string>) {
  // Check parameters
  proc.parameters?.forEach((param) => {
    if (param.schema) {
      extractSchemaRefs(param.schema, usedSchemas);
    }
  });

  // Check request body
  if (proc.body?.schema) {
    extractSchemaRefs(proc.body.schema, usedSchemas);
  }

  // Check response
  if (proc.response?.schema) {
    extractSchemaRefs(proc.response.schema, usedSchemas);
  }
}

function extractSchemaRefs(schema: string, usedSchemas: Set<string>) {
  const refs = schema.match(/z\.lazy\(\(\) => (\w+)\)/g);
  if (refs) {
    refs.forEach((ref) => {
      const schemaName = ref.match(/=> (\w+)/)?.[1];
      if (schemaName) {
        usedSchemas.add(schemaName);
      }
    });
  }
}

function buildInputSchema(proc: ProcedureConfig): string {
  if (proc.type === "mutation" && proc.body) {
    return proc.body.schema || "z.object({})";
  }

  const schemaFields: string[] = [];

  // Handle path parameters
  proc.parameters?.forEach((param) => {
    if (param.type === "path") {
      schemaFields.push(`${param.name}: ${param.schema || "z.any()"}`);
    }
  });

  // Handle request body
  if (proc.body) {
    // Use the body schema directly without trying to access .shape
    schemaFields.push(`...${proc.body.schema || "z.object({})"}`);
  }

  // Handle query parameters
  const queryParams = proc.parameters?.filter((p) => p.type === "query");
  if (queryParams?.length > 0) {
    schemaFields.push(
      `params: z.object({${queryParams
        .map(
          (param) =>
            `${param.name}: ${param.schema || "z.any()"}${param.required ? "" : ".optional()"}`
        )
        .join(",\n    ")}}).optional()`
    );
  }

  // If no fields, return empty object schema
  if (schemaFields.length === 0) {
    return "z.object({})";
  }

  return `z.object({\n    ${schemaFields.join(",\n    ")}\n  })`;
}

function normalizeRouteName(name: string): string {
  if (!name) return "operation";

  // Replace invalid characters and ensure the name starts with a letter or underscore
  let processedName = name.replace(/[^a-zA-Z0-9_]/g, "_");

  if (!/^[a-zA-Z_]/.test(processedName)) {
    processedName = "_" + processedName;
  }

  return processedName;
}

function getErrorCode(proc: ProcedureConfig): string {
  if (proc.type === "query") {
    return proc.name.toLowerCase().includes("get")
      ? "NOT_FOUND"
      : "INTERNAL_SERVER_ERROR";
  }
  return "BAD_REQUEST";
}

function getErrorMessage(proc: ProcedureConfig): string {
  return `\`Error in ${proc.type} '${normalizeRouteName(proc.name)}': \${error instanceof Error ? error.message : 'Unknown error'}\``;
}

async function generateTrpcRouters(
  swaggerUrl: string,
  routersDir: string
): Promise<void> {
  const routes: RouteConfig[] = [];

  try {
    const { files } = await generateApi({
      name: "temp-api.ts",
      url: swaggerUrl,
      templates: path.resolve(__dirname, "./templates"),
      generateClient: false,
      generateRouteTypes: true,
      hooks: {
        onCreateRoute: (routeData: ParsedRoute) => {
          const routeName = routeData.routeName.usage;
          const path = routeData.raw.route;
          let route = routes.find((r) => r.name === routeName);
          if (!route) {
            route = {
              name: routeName,
              namespace: routeData.namespace,
              description: routeData.jsDocLines || "",
              procedures: [],
            };
            routes.push(route);
          }

          const procedureType =
            routeData.request.method.toLowerCase() === "get"
              ? "query"
              : "mutation";
          const procedureName =
            routeData.raw.operationId ||
            `${procedureType}${path.split("/").pop()}`;

          // Extract parameters and body
          const parameters = (routeData.parameters || []).map((param: any) => ({
            name: param.name,
            type: param.schema.type || "string",
            required: param.required || false,
            schema: convertToZodSchema(param.schema, new Set()),
          }));

          // Handle request body
          let body: { schema: string } | null = null;
          if (
            routeData.raw.requestBody &&
            "content" in routeData.raw.requestBody
          ) {
            const requestBody = routeData.raw
              .requestBody as OpenAPIV3.RequestBodyObject;
            const jsonContent = requestBody.content?.["application/json"];
            if (jsonContent?.schema) {
              body = {
                schema: convertToZodSchema(jsonContent.schema, new Set()),
              };
            }
          }

          // Handle response
          let response: { schema: string } | null = null;
          if (routeData.response) {
            const successResponse = routeData.response;
            if (successResponse && "content" in successResponse) {
              const jsonContent = (
                successResponse.content as Record<string, any>
              )?.["application/json"];
              if (jsonContent?.schema) {
                response = {
                  schema: convertToZodSchema(jsonContent.schema, new Set()),
                };
              }
            }
          }

          route.procedures.push({
            name: procedureName,
            type: procedureType,
            parameters,
            body,
            response,
            description: routeData.jsDocLines || "",
          });

          return routeData;
        },
      },
    });

    // Generate context and utilities
    generateContext(routersDir);
    generateTrpcUtils(routersDir);

    // Generate individual router files
    routes.forEach((route) => {
      generateRouterFile(route, routersDir);
    });

    // Generate app router
    const routerFiles = routes.map((route) => `${route.name}.ts`);
    generateAppRouter(routerFiles, routersDir);

    console.log("tRPC server files generated successfully!");
  } catch (error) {
    console.error("Error generating tRPC server:", error);
    throw error;
  }
}

function generateContext(routersDir: string, apiName: string = "Api") {
  const content = `import { inferAsyncReturnType } from '@trpc/server';
  import { CreateNextContextOptions } from '@trpc/server/adapters/next';
  import { getSession } from 'next-auth/react';
  import { Api } from "./__generated__/${apiName}";

  export async function createContext({ req, res }: CreateNextContextOptions) {
    const session = await getSession({ req });
    
    return {
      req,
      res,
      session,
      api: new Api({
        baseUrl: process.env.API_BASE_URL!,
        // Add any API configuration here
      }),
    };
  }

  export type Context = inferAsyncReturnType<typeof createContext>;`;

  fs.writeFileSync(path.resolve(routersDir, "../context.ts"), content);
}
function generateTrpcUtils(routersDir: string) {
  const utilsContent = `import { initTRPC, TRPCError } from '@trpc/server';
  import superjson from 'superjson';
  import { Context } from './context';

  const t = initTRPC.context<Context>().create({
    transformer: superjson,
  });

  export const router = t.router;
  export const publicProcedure = t.procedure;

  const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        ...ctx,
        // Infers that the \`session\` is non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

  export const protectedProcedure = t.procedure.use(isAuthed);`;

  fs.writeFileSync(path.resolve(routersDir, "../trpc.ts"), utilsContent);
}
function generateAppRouter(routerFiles: string[], routersDir: string) {
  const imports = routerFiles
    .map((file) => {
      const name = path.basename(file, ".ts");
      return `import { ${name}Router } from './${name}';`;
    })
    .join("\n");

  const routers = routerFiles
    .map((file) => {
      const name = path.basename(file, ".ts");
      return `  ${name}: ${name}Router,`;
    })
    .join("\n");

  const content = `import { router } from '../trpc';
  ${imports}

  export const appRouter = router({
  ${routers}
  });

  export type AppRouter = typeof appRouter;`;

  fs.writeFileSync(path.resolve(routersDir, "_app.ts"), content);
}
export async function generateTrpcServer(
  routersDir: string,
  swaggerUrl: string,
  apiName: string
): Promise<void> {
  if (!routersDir || !swaggerUrl) {
    throw new Error("routersDir and swaggerUrl are required");
  }

  // Ensure directories exist
  ensureDirExists(routersDir);

  try {
    await generateTrpcRouters(swaggerUrl, routersDir);
  } catch (error) {
    throw new Error(
      `Failed to generate tRPC server: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}


