import path from "path";
import fs from "fs";
import {
  generateApi,
  ParsedRoute,
  GenerateApiOutput,
  RequestContentKind,
  SCHEMA_TYPES,
} from "swagger-typescript-api";
import { ensureDirExists, convertToZodSchema } from "./helpers";
import { SchemaRegistry } from "./schema-registry";
// Basic implementations for missing imports
import { OpenAPIV3 } from "openapi-types";
import { z } from "zod";

function getSchemaName(originalSchema: any, parsedSchema: any): string | null {
  return originalSchema.title || null;
}

// Rest of your code...

interface ProcedureConfig {
  name: string;
  type: "query" | "mutation";
  parameters: Array<{
    name: string;
    type: "path" | "query";
    required: boolean;
    schema: string;
  }>;
  body?: {
    schema: string;
  } | null;
  response?: {
    schema: string;
  } | null;
  description: string;
  path: string;
  method: string;
}

async function generateTrpcServer(
  routersDir: string,
  swaggerUrl: string
): Promise<void> {
  try {
    new URL(swaggerUrl); // This will throw if the URL is invalid
  } catch (error) {
    throw new Error(
      `Invalid swagger URL provided: "${swaggerUrl}". Please provide a valid URL starting with http:// or https://`
    );
  }
  console.log("Generating tRPC server...", swaggerUrl);
  const schemaRegistry = new SchemaRegistry();
  const procedures: ProcedureConfig[] = [];
  
  try {
    // First pass: collect all schemas
    await generateApi({
      name: "api.ts",
      url: swaggerUrl,
      generateClient: false,
      generateRouteTypes: true,
      hooks: {
        onParseSchema: (originalSchema: any, parsedSchema: any) => {
          try {
            // Register raw schema first
            if (originalSchema?.$ref) {
              const refName = originalSchema.$ref.split("/").pop();
              if (refName) {
                const dependencies = new Set<string>();
                const zodSchema = convertToZodSchema(
                  parsedSchema,
                  dependencies,
                  schemaRegistry
                );
                schemaRegistry.add(refName, zodSchema, dependencies);
              }
            }

            const schemaName = getSchemaName(originalSchema, parsedSchema);
            if (schemaName) {
              const dependencies = new Set<string>();
              const zodSchema = convertToZodSchema(
                parsedSchema,
                dependencies,
                schemaRegistry
              );
              schemaRegistry.add(schemaName, zodSchema, dependencies);
            }

            return parsedSchema;
          } catch (error) {
            console.warn("Error in onParseSchema:", error);
            return parsedSchema;
          }
        },
      },
    });

    // Second pass: process routes with complete schema registry
    await generateApi({
      name: "api.ts",
      url: swaggerUrl,
      generateClient: false,
      generateRouteTypes: true,
      hooks: {
        onCreateRoute: (routeData: ParsedRoute) => {
          try {
            const procedure = extractProcedure(routeData, schemaRegistry);
            if (procedure) {
              procedures.push(procedure);
            }
            return routeData;
          } catch (error) {
            console.warn("Error in onCreateRoute:", error);
            return routeData;
          }
        },
      },
    });

    // Generate the router file
    generateRouterFile(procedures, schemaRegistry, routersDir);

    // Generate supporting files
    generateContextFile(routersDir);
    generateTrpcUtilsFile(routersDir);

    console.log("tRPC server files generated successfully!");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to generate tRPC server: ${error.message}\nPlease ensure the swagger URL is accessible and returns valid OpenAPI/Swagger documentation.`
      );
    }
    throw new Error("Failed to generate tRPC server: Unknown error occurred");
  }
}

function extractProcedure(
  routeData: ParsedRoute,
  schemaRegistry: SchemaRegistry
): ProcedureConfig {
  const method = routeData.raw.method.toLowerCase();
  const isQuery = method === "get";

  // Extract parameters from path and query
  const parameters: ProcedureConfig["parameters"] = [];

  // Handle OpenAPI parameters if they exist
  if (
    "parameters" in routeData.raw &&
    Array.isArray(routeData.raw.parameters)
  ) {
    for (const param of routeData.raw.parameters) {
      if (
        "name" in param &&
        "in" in param &&
        ("schema" in param || "type" in param)
      ) {
        parameters.push({
          name: param.name,
          type: param.in as "path" | "query",
          required: param.required || false,
          schema: convertParameterToZodSchema(param, schemaRegistry),
        });
      }
    }
  }

  // Extract body schema if present
  let body = null;
  if (
    routeData.raw.requestBody &&
    typeof routeData.raw.requestBody === "object"
  ) {
    const requestBody = routeData.raw.requestBody as {
      content?: Record<string, { schema?: unknown }>;
      required?: boolean;
    };

    if (requestBody.content) {
      const mediaType =
        requestBody.content["application/json"] ||
        requestBody.content[Object.keys(requestBody.content)[0]];

      if (mediaType?.schema) {
        const dependencies = new Set<string>();
        const bodySchema = convertToZodSchema(
          mediaType.schema,
          dependencies,
          schemaRegistry
        );
        if (bodySchema) {
          body = {
            schema: bodySchema,
            // required: requestBody.required ?? true,
          };
        }
      }
    }
  }

  // Extract response schema if present
  let response = null;
  if (routeData.raw.responses) {
    const successResponse =
      (routeData.raw.responses as Record<string, any>)["200"] ||
      (routeData.raw.responses as Record<string, any>)["201"];

    if (successResponse?.content) {
      const mediaType =
        successResponse.content["application/json"] ||
        successResponse.content[Object.keys(successResponse.content)[0]];

      if (mediaType?.schema) {
        const responseSchema = convertToZodSchema(
          mediaType.schema,
          new Set(),
          schemaRegistry
        );
        if (responseSchema) {
          response = { schema: responseSchema };
        }
      }
    }
  }

  return {
    name: normalizeRouteName(routeData.routeName.usage),
    type: isQuery ? "query" : "mutation",
    parameters,
    body,
    response,
    description: routeData.raw.description || "",
    path: routeData.raw.route,
    method: routeData.raw.method,
  };
}

function generateRouterFile(
  procedures: ProcedureConfig[],
  schemaRegistry: SchemaRegistry,
  routersDir: string
) {
  const orderedSchemas = schemaRegistry.getOrderedSchemas();

  let content = `import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Schema Definitions
${orderedSchemas
  .map(({ name, schema }) => `export const ${name} = ${schema};`)
  .join("\n\n")}

export const appRouter = router({
${procedures.map(generateProcedureCode).join(",\n\n")}
});

export type AppRouter = typeof appRouter;`;

  try {
    // Ensure the directory exists
    ensureDirExists(routersDir);

    // Write the router file
    fs.writeFileSync(path.resolve(routersDir, "_app.ts"), content);
  } catch (error) {
    throw new Error(
      `Failed to write router file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

function generateProcedureCode(proc: ProcedureConfig): string {
  const inputSchema = buildInputSchema(proc);
  const procedureType =
    proc.type === "query" ? "publicProcedure" : "protectedProcedure";
  const errorCode = getErrorCode(proc);
  const apiCall = buildApiCall(proc);

  return `  ${proc.name}: ${procedureType}
    .input(${inputSchema})
    .${proc.type}(async ({ ctx, input }) => {
      try {
        return await ${apiCall};
      } catch (error) {
        throw new TRPCError({
          code: '${errorCode}',
          message: \`${getErrorMessage(proc)}: \${error instanceof Error ? error.message : 'Unknown error'}\`,
          cause: error
        });
      }
    })`;
}

function buildInputSchema(proc: ProcedureConfig): string {
  // For empty parameters and no body, use the interface's empty object type
  if (proc.parameters.length === 0 && !proc.body) {
    return `z.object({})`;
  }

  // Find the corresponding method in the API interface
  const methodParts = proc.path.split("/");
  const baseResource = methodParts[1]; // e.g., 'vehicles', 'categories', etc.
  const methodName = `${baseResource}${capitalizeFirst(proc.name)}`;

  // If there's a corresponding interface for the method params, use it
  if (proc.parameters.length > 0) {
    return `z.object({
    ${proc.parameters
      .map((param) => {
        const paramName = param.name;
        const paramSchema = param.schema;
        return `${paramName}: ${paramSchema}${param.required ? "" : ".optional()"}`;
      })
      .join(",\n    ")}
  })`;
  }

  // If there's a body parameter, use the corresponding interface
  if (proc.body) {
    return proc.body.schema;
  }

  return `z.object({})`;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildApiCall(proc: ProcedureConfig): string {
  // Build URL with path parameters
  let url = proc.path;
  if (proc.parameters.filter((p) => p.type === "path").length > 0) {
    proc.parameters
      .filter((p) => p.type === "path")
      .forEach((param) => {
        url = url.replace(`{${param.name}}`, `\${input.${param.name}}`);
      });
    url = `\`${url}\``;
  } else {
    url = `'${url}'`;
  }

  // Query parameters
  let queryParams = "";
  const queryParamsList = proc.parameters
    .filter((p) => p.type === "query")
    .map((param) => `${param.name}: input.${param.name}`);
  if (queryParamsList.length > 0) {
    queryParams = `{ ${queryParamsList.join(", ")} }`;
  }

  // Body parameter (if it exists)
  const bodyArg = proc.body ? "input" : "";

  // Construct the API call
  let call = `ctx.api.${proc.method.toLowerCase()}(${url}`;
  if (queryParams || bodyArg) {
    call += `, ${queryParams || "undefined"}`;
  }
  if (bodyArg) {
    call += `, ${bodyArg}`;
  }
  call += `)`;

  return call;
}

function generateContextFile(routersDir: string) {
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
    }),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;`;

  fs.writeFileSync(path.resolve(routersDir, "../context.ts"), content);
}

function generateTrpcUtilsFile(routersDir: string) {
  const content = `import { initTRPC, TRPCError } from '@trpc/server';
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
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);`;

  fs.writeFileSync(path.resolve(routersDir, "../trpc.ts"), content);
}

function normalizeRouteName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/^(\d)/, "_$1")
    .replace(/^$/, "operation")
    .toLowerCase();
}

function getErrorCode(proc: ProcedureConfig): string {
  switch (proc.type) {
    case "query":
      return "NOT_FOUND";
    case "mutation":
      return "BAD_REQUEST";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}

function getErrorMessage(proc: ProcedureConfig): string {
  const method = proc.method.toUpperCase();
  return `Error during ${method} ${proc.path}`;
}

function convertParameterToZodSchema(
  param: any,
  schemaRegistry: SchemaRegistry
): string {
  const baseSchema = convertToZodSchema(
    param.schema || {},
    new Set(),
    schemaRegistry
  );
  return baseSchema;
}

export { generateTrpcServer };
