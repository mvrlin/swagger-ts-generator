// @ts-nocheck
import path from "path";
import fs from "fs";
import { generateApi, ParsedRoute } from "swagger-typescript-api";
import { RouteConfig, ParameterConfig, Config } from "./types";
import { convertToZodSchema } from "./helpers";
import { OpenAPIV2, OpenAPIV3 } from "openapi-types";

interface ExtractedParameters {
  parameters: ParameterConfig[];
  body: {
    schema: string;
  } | null;
}

function generateAppRouter(routerFiles: string[], routersDir: string): void {
  try {
    fs.mkdirSync(routersDir, { recursive: true });

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

export type AppRouter = typeof appRouter;
`;

    const outputPath = path.resolve(routersDir, "_app.ts");
    fs.writeFileSync(outputPath, content);
  } catch (error) {
    throw new Error(
      `Failed to write app router file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

function extractParameters(routeData: ParsedRoute): ExtractedParameters {
  const parsedSchemas = routeData.raw?.parsedSchemas;
  const parameters: ParameterConfig[] = [];
  let body = null;

  // Handle path parameters
  if (routeData.request?.path) {
    parameters.push(
      ...routeData.request.path.map((param: any) => ({
        name: param.name,
        type: param.type,
        required: true,
        schema: convertToZodSchema(param.schema, parsedSchemas),
      }))
    );
  }

  // Handle query parameters
  if (routeData.request?.query) {
    parameters.push(
      ...routeData.request.query.map((param: any) => ({
        name: param.name,
        type: param.type,
        required: param.required,
        schema: convertToZodSchema(param.schema, parsedSchemas),
      }))
    );
  }

  // Handle request body
  const bodyContent = routeData.request?.body as any;
  if (bodyContent?.content?.["application/json"]?.schema) {
    body = {
      schema: convertToZodSchema(
        bodyContent.content["application/json"].schema,
        parsedSchemas
      ),
    };
  }

  return { parameters, body };
}

async function generateTrpcRouters(
  config: Config,
  routersDir: string
): Promise<void> {
  if (!config.swaggerUrl) {
    throw new Error("Swagger URL is required");
  }

  const routes: RouteConfig[] = [];

  try {
    const { files } = await generateApi({
      name: "trpc-routers.ts",
      output: routersDir,
      url: config.swaggerUrl,
      templates: path.resolve(__dirname, "./templates"),
      generateClient: false,
      generateRouteTypes: true,
      hooks: {
        onCreateRoute: (routeData: ParsedRoute): ParsedRoute => {
          const routeName = routeData.routeName.original;
          let route = routes.find((r) => r.name === routeName);

          if (!route) {
            route = {
              name: routeName,
              description: routeData.jsDocLines || "",
              procedures: [],
            };
            routes.push(route);
          }

          const procedureType =
            routeData.request?.method.toLowerCase() === "get"
              ? "query"
              : "mutation";
          const procedureName = routeData.id;
          const { parameters, body } = extractParameters(routeData);

          // Handle response schema
          const responseContent = routeData.response?.success as any;
          const response = responseContent?.content?.["application/json"]
            ?.schema
            ? {
                schema: convertToZodSchema(
                  responseContent.content["application/json"].schema,
                  routeData.raw?.parsedSchemas
                ),
              }
            : null;

          route.procedures.push({
            name: procedureName,
            type: procedureType,
            parameters,
            body,
            response,
            description: routeData.description || "",
          });

          return routeData;
        },
      },
    });

    const validFiles = files
      .map((f) => f.fileName)
      .filter((fileName): fileName is string => Boolean(fileName));

    generateAppRouter(validFiles, routersDir);

    console.log("tRPC routers generated successfully!");
  } catch (error) {
    throw new Error(
      `Error generating tRPC routers: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

async function generateTrpcServer(
  routersDir: string,
  templatesDir: string,
  swaggerUrl: string
): Promise<void> {
  if (!routersDir || !templatesDir || !swaggerUrl) {
    throw new Error("routersDir, templatesDir, and swaggerUrl are required");
  }

  try {
    await generateTrpcRouters(
      {
        swaggerUrl,
        templatesDir,
      } as Config,
      routersDir
    );
  } catch (error) {
    throw new Error(
      `Failed to generate tRPC server: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export { generateTrpcServer };
