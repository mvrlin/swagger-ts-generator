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

function generateRouterFile(
  routeName: string,
  routeNamespace: string,
  procedures: ProcedureConfig[],
  schemaRegistry: SchemaRegistry,
  routersDir: string
) {
  let content = `import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';\n\n`;

  // Add schemas
  const usedSchemas = new Set<string>();
  procedures.forEach((proc) => {
    collectUsedSchemas(proc, usedSchemas);
  });

  // Generate schema definitions
  content += "// Schema Definitions\n";
  const orderedSchemas = schemaRegistry
    .getOrderedSchemas()
    .filter(({ name }) => usedSchemas.has(name));

  orderedSchemas.forEach(({ name, schema }) => {
    content += `export const ${name} = ${schema};\n\n`;
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
    const inputSchema = buildInputSchema(proc);
    const apiNamespace = routeNamespace;
    content += `  ${normalizeRouteName(proc.name)}: ${procedureType}
      .input(${inputSchema})
      .${proc.type}(async ({ input, ctx }) => {
        try {
          const response = await ctx.api.${apiNamespace}.${camelCase(proc.name)}(input);
          return response;
        } catch (error) {
          throw new TRPCError({
            code: '${getErrorCode(proc)}',
            message: ${getErrorMessage(proc)},
            cause: error,
          });
        }
      }),
`;
  });

  content += "});\n";

  // Write the file
  fs.writeFileSync(path.resolve(routersDir, `${routeName}.ts`), content);
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
  // If there's only one parameter and no body, return the parameter schema directly
  if (proc.parameters?.length === 1 && !proc.body) {
    const param = proc.parameters[0];
    return param.schema || "z.any()";
  }

  const schemaFields: string[] = [];

  // Handle query parameters
  if (proc.parameters?.length > 0) {
    proc.parameters.forEach((param) => {
      schemaFields.push(
        `${param.name}: ${param.schema || "z.any()"}${param.required ? "" : ".optional()"}`
      );
    });
  }

  // Handle request body if present
  if (proc.body) {
    if (proc.parameters?.length > 0) {
      schemaFields.push(`body: ${proc.body.schema || "z.any()"}`);
    } else {
      // If we only have body, use it directly
      return proc.body.schema || "z.object({})";
    }
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
  routersDir: string,
  apiName: string
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
          try {
            // Get schema name
            let schemaName = getSchemaName(originalSchema, parsedSchema);
            if (!schemaName) return parsedSchema;

            // Get dependencies
            const dependencies = new Set<string>();
            const zodSchema = convertToZodSchema(parsedSchema, dependencies);

            // Register schema
            schemaRegistry.add(schemaName, zodSchema, dependencies);

            return parsedSchema;
          } catch (error) {
            console.warn("Error in onParseSchema:", error);
            return parsedSchema;
          }
        },

        onCreateRoute: (routeData: ParsedRoute) => {
          try {
            const routeName =
              routeData.raw.tags?.[0]?.replace(/\s+/g, "") || "common";
            const procedures = extractProcedures(
              routeData as ParsedRoute & {
                raw: { parameters?: any[]; operationId?: string };
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
                  [status: string]: {
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
            generateRouterFile(
              routeName,
              routeData.namespace,
              procedures,
              schemaRegistry,
              routersDir
            );

            return routeData;
          } catch (error) {
            console.warn("Error in onCreateRoute:", error);
            return routeData;
          }
        },
      },
    });

    // Generate additional files
    generateContext(routersDir, apiName);
    generateTrpcUtils(routersDir);
    generateAppRouter(
      Array.from(new Set(files.map((f) => path.basename(f.fileName, ".ts")))),
      routersDir
    );

    console.log("tRPC server files generated successfully!");
  } catch (error) {
    console.error("Error generating tRPC server:", error);
    throw error;
  }
}

function extractProcedures(
  routeData: ParsedRoute & {
    raw: {
      operationId?: string;
      parameters?: Array<{
        name: string;
        schema: { type?: string };
        required?: boolean;
      }>;
    };
    path?: string;
    method?: string;
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
      [status: string]: {
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

  const procedureName = getProcedureName(routeData);

  // Extract parameters
  const parameters = (routeData.raw.parameters || []).map((param: any) => ({
    name: param.name,
    type: param.schema.type || "string",
    required: param.required || false,
    schema: convertToZodSchema(param.schema, new Set()),
  }));

  // Handle request body
  const bodyContent =
    routeData.request.body?.content?.["application/json"]?.schema;
  const body = bodyContent
    ? {
        schema: convertToZodSchema(bodyContent, new Set()),
      }
    : null;

  // Handle response
  const responseContent =
    routeData.responses?.["200"]?.content?.["application/json"]?.schema;
  const response = responseContent
    ? {
        schema: convertToZodSchema(responseContent, new Set()),
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

function getProcedureName(routeData: ParsedRoute): string {
  const resourceName = routeData.routeName.usage;
  return normalizeRouteName(resourceName);
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
    await generateTrpcRouters(swaggerUrl, routersDir, apiName);
  } catch (error) {
    throw new Error(
      `Failed to generate tRPC server: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

