import path from "path";
import fs from "fs";
import { generateApi, ParsedRoute } from "swagger-typescript-api";
import { RouteConfig, ParameterConfig, Config, ProcedureConfig } from "./types";
import { ensureDirExists, convertToZodSchema } from "./helpers";
import { OpenAPIV2, OpenAPIV3 } from "openapi-types";
import SchemaRegistry from "./schema-registry";

function generateRouterFile(
  routeName: string,
  procedures: ProcedureConfig[],
  schemaRegistry: SchemaRegistry,
  routersDir: string
) {
  let content = `import { z } from 'zod';
  import { router, publicProcedure, protectedProcedure } from '../trpc';
  import { TRPCError } from '@trpc/server';

  // Schema Definitions
  `;

  // Add schemas in dependency order
  const orderedSchemas = schemaRegistry.getOrderedSchemas();
  orderedSchemas.forEach(({ name, schema }) => {
    content += `const ${name} = ${schema};\n\n`;
  });

  // Start router definition
  content += `export const ${routeName}Router = router({\n`;

  // Add procedures
  procedures.forEach((proc) => {
    const isProtected = proc.type === "mutation";
    const procedureType = isProtected
      ? "protectedProcedure"
      : "publicProcedure";

    // Build input schema
    const inputSchemaParams: string[] = [];
    if (proc.parameters.length > 0) {
      proc.parameters.forEach((param) => {
        inputSchemaParams.push(`    ${param.name}: ${param.schema}`);
      });
    }
    if (proc.body) {
      inputSchemaParams.push(`    data: ${proc.body.schema}`);
    }

    const inputSchema =
      inputSchemaParams.length > 0
        ? `z.object({\n${inputSchemaParams.join(",\n")}\n  })`
        : "z.object({})";

    // Add procedure implementation
    content += `
    ${proc.name}: ${procedureType}
      .input(${inputSchema})
      .${proc.type}(async ({ input, ctx }) => {
        try {
          ${generateProcedureImplementation(proc)}
        } catch (error) {
          throw new TRPCError({
            code: '${getErrorCode(proc)}',
            message: '${getErrorMessage(proc)}',
          });
        }
      }),\n`;
  });

  content += "});\n";

  // Write the file
  fs.writeFileSync(path.resolve(routersDir, `${routeName}.ts`), content);
}

function generateProcedureImplementation(proc: ProcedureConfig): string {
  switch (proc.type) {
    case "query":
      if (
        proc.name.startsWith("get") &&
        proc.parameters.some((p) => p.name === "id")
      ) {
        return `
          const response = await ctx.api.${proc.name}(input.id);
          return response;`;
      } else {
        return `
          const response = await ctx.api.${proc.name}(input);
          return response;`;
      }

    case "mutation":
      if (proc.name.startsWith("create")) {
        return `
          const response = await ctx.api.${proc.name}Create(input.data);
          return response;`;
      } else if (proc.name.startsWith("update")) {
        return `
          const response = await ctx.api.${proc.name}(input.id, input.data);
          return response;`;
      } else if (proc.name.startsWith("delete")) {
        return `
          await ctx.api.${proc.name}(input.id);
          return { success: true };`;
      } else {
        return `
          const response = await ctx.api.${proc.name}(input);
          return response;`;
      }
  }
}

function getErrorCode(proc: ProcedureConfig): string {
  switch (proc.type) {
    case "query":
      return proc.name.startsWith("get")
        ? "NOT_FOUND"
        : "INTERNAL_SERVER_ERROR";
    case "mutation":
      return "BAD_REQUEST";
  }
}

function getErrorMessage(proc: ProcedureConfig): string {
  const operation = proc.name.startsWith("get")
    ? "fetch"
    : proc.name.startsWith("create")
      ? "create"
      : proc.name.startsWith("update")
        ? "update"
        : proc.name.startsWith("delete")
          ? "delete"
          : "process";

  const resource = proc.name
    .replace(/(get|create|update|delete)/, "")
    .toLowerCase();
  return `Failed to ${operation} ${resource}`;
}

async function generateTrpcRouters(
  swaggerUrl: string,
  routersDir: string
): Promise<void> {
  try {
    // Initialize schema registry
    const schemaRegistry = new SchemaRegistry();

    // Parse OpenAPI spec
    const { files } = await generateApi({
      name: "temp-api.ts",
      url: swaggerUrl,
      generateClient: false,
      generateRouteTypes: true,
      hooks: {
        onParseSchema: (originalSchema: any, parsedSchema: any) => {
          // Register schema with dependencies
          const dependencies = new Set<string>();
          const zodSchema = convertToZodSchema(parsedSchema, dependencies);
          schemaRegistry.add(originalSchema, zodSchema, dependencies);
        },

        onCreateRoute: (routeData: ParsedRoute) => {
          const routeName =
            routeData.raw.tags?.[0]?.replace(/\s+/g, "") || "common";
          const procedures = extractProcedures(
            routeData as ParsedRoute & {
              raw: { parameters?: any[] };
              request: {
                method: string;
                body?: {
                  content?: {
                    "application/json"?: {
                      schema?: any;
                    };
                  };
                };
              };
              responses?: {
                "200"?: {
                  content?: {
                    "application/json"?: {
                      schema?: any;
                    };
                  };
                };
              };
            },
            schemaRegistry
          );

          // Generate router file for this route
          generateRouterFile(routeName, procedures, schemaRegistry, routersDir);

          return routeData;
        },
      },
    });

    // Generate context with API client integration
    generateContext(routersDir);

    // Generate trpc.ts with proper middleware
    generateTrpcUtils(routersDir);

    // Generate app router
    const routerFiles = Array.from(
      new Set(files.map((f) => path.basename(f.fileName, ".ts")))
    );
    generateAppRouter(routerFiles, routersDir);

    console.log("tRPC server files generated successfully!");
  } catch (error) {
    console.error("Error generating tRPC server:", error);
    throw error;
  }
}

function generateContext(routersDir: string) {
  const content = `import { inferAsyncReturnType } from '@trpc/server';
  import { CreateNextContextOptions } from '@trpc/server/adapters/next';
  import { getSession } from 'next-auth/react';
  import { Api } from '../generated/api';

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
function extractProcedures(
  routeData: ParsedRoute & {
    raw: {
      parameters?: Array<{
        name: string;
        schema: { type?: string };
        required?: boolean;
      }>;
    };
    request: {
      method: string;
      body?: {
        content?: {
          "application/json"?: {
            schema?: any;
          };
        };
      };
    };
    responses?: {
      "200"?: {
        content?: {
          "application/json"?: {
            schema?: any;
          };
        };
      };
    };
  },
  schemaRegistry: SchemaRegistry
): ProcedureConfig[] {
  const procedures: ProcedureConfig[] = [];

  // Extract basic info
  const procedureType =
    routeData.request.method.toLowerCase() === "get" ? "query" : "mutation";
  const procedureName = routeData.id;

  // Extract parameters
  const parameters = (routeData.raw.parameters || []).map((param: any) => ({
    name: param.name,
    type: param.schema.type || "string",
    required: param.required || false,
    schema: convertToZodSchema(param.schema, schemaRegistry),
  }));

  // Handle request body
  const bodyContent =
    routeData.request.body?.content?.["application/json"]?.schema;
  const body = bodyContent
    ? {
        schema: convertToZodSchema(bodyContent, schemaRegistry),
      }
    : null;

  // Handle response
  const responseContent =
    routeData.responses?.["200"]?.content?.["application/json"]?.schema;
  const response = responseContent
    ? {
        schema: convertToZodSchema(responseContent, schemaRegistry),
      }
    : null;

  procedures.push({
    name: procedureName,
    type: procedureType,
    parameters,
    body,
    response,
    description: routeData.jsDocLines || "",
  });

  return procedures;
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
  swaggerUrl: string
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
