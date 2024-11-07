import path from "path";
import fs from "fs";
import { generateApi } from "swagger-typescript-api";
import { RouteConfig, ParameterConfig, Config } from "./types";
import { convertToZodSchema } from "./helpers";
import { OpenAPIV2, OpenAPIV3 } from "openapi-types";

// Generates the main app router file
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

export type AppRouter = typeof appRouter;
`;

  fs.writeFileSync(path.resolve(routersDir, "_app.ts"), content);
}

async function generateTrpcRouters(config: Config, routersDir: string) {
  try {
    const { files } = await generateApi({
      name: "trpc-routers.ts",
      output: routersDir,
      url: config.swaggerUrl,
      templates: path.resolve(__dirname, "./templates"),
      generateClient: false,
      generateRouteTypes: true,
      hooks: {
        onParseSchema: (schema: unknown, parsedSchemas: unknown) => {
          const routes: RouteConfig[] = [];
          if (schema && typeof schema === "object" && "paths" in schema) {
            const typedSchema = schema as
              | OpenAPIV2.Document
              | OpenAPIV3.Document;
            const isV3 =
              "openapi" in typedSchema && typedSchema.openapi.startsWith("3.");

            for (const [path, pathItem] of Object.entries(typedSchema.paths)) {
              if (!pathItem) continue;
              const routeName = path.split("/")[1];
              let route = routes.find((r) => r.name === routeName);

              if (!route) {
                route = {
                  name: routeName,
                  description: "",
                  procedures: [],
                };
                routes.push(route);
              }

              for (const [method, operation] of Object.entries(pathItem)) {
                if (method === "parameters" || !operation) continue;
                if (typeof operation === "string") continue;

                const procedureType = method === "get" ? "query" : "mutation";
                const procedureName =
                  (typeof operation === "object" && "operationId" in operation
                    ? (operation.operationId as string)
                    : undefined) || `${method}${routeName}`;
                const parameters: ParameterConfig[] = [];

                const parameterList =
                  isV3 && "parameters" in pathItem ? pathItem.parameters : [];
                const operationParameters =
                  typeof operation === "object" &&
                  operation !== null &&
                  "parameters" in operation
                    ? operation.parameters
                    : [];
                const allParameters = [
                  ...(Array.isArray(parameterList) ? parameterList : []),
                  ...(Array.isArray(operationParameters)
                    ? operationParameters
                    : []),
                ];

                for (const param of allParameters) {
                  const paramSchema = "schema" in param ? param.schema : param;
                  parameters.push({
                    name: "$ref" in param ? "" : param.name,
                    schema: convertToZodSchema(paramSchema, parsedSchemas),
                    required: "$ref" in param ? false : param.required || false,
                  });
                }

                let body;
                const requestBody =
                  typeof operation === "object" &&
                  operation !== null &&
                  "requestBody" in operation
                    ? operation.requestBody
                    : undefined;
                if (
                  requestBody &&
                  typeof requestBody === "object" &&
                  "content" in requestBody &&
                  requestBody.content &&
                  typeof requestBody.content === "object"
                ) {
                  const contentType = Object.keys(requestBody.content)[0];
                  const content = requestBody.content as Record<
                    string,
                    OpenAPIV3.MediaTypeObject
                  >;
                  if (contentType && content[contentType]) {
                    const mediaType = content[contentType];
                    if ("schema" in mediaType) {
                      body = {
                        schema: convertToZodSchema(
                          mediaType.schema,
                          parsedSchemas
                        ),
                      };
                    }
                  }
                }

                let response;
                if (
                  typeof operation === "object" &&
                  operation !== null &&
                  "responses" in operation &&
                  operation.responses &&
                  typeof operation.responses === "object"
                ) {
                  const responses = operation.responses as Record<
                    string,
                    OpenAPIV3.ResponseObject
                  >;
                  const successResponse = responses["200"];
                  if (successResponse) {
                    if ("schema" in successResponse) {
                      response = {
                        schema: convertToZodSchema(
                          successResponse.schema,
                          parsedSchemas
                        ),
                      };
                    } else if (
                      successResponse.content &&
                      typeof successResponse.content === "object"
                    ) {
                      const contentType = Object.keys(
                        successResponse.content
                      )[0];
                      const mediaType = successResponse.content[contentType];
                      if (mediaType) {
                        response = {
                          schema: convertToZodSchema(
                            mediaType.schema,
                            parsedSchemas
                          ),
                        };
                      }
                    }
                  }
                }

                route.procedures.push({
                  name: procedureName,
                  type: procedureType,
                  parameters,
                  body,
                  response,
                });
              }
            }
          }
          return routes;
        },
      },
    });

    for (const file of files) {
      if (!file.fileName) {
        console.error("Error: File name is undefined");
        continue;
      }

      const filePath = path.resolve(routersDir, file.fileName);
      fs.writeFileSync(filePath, file.fileContent);
      console.log(`Generated ${file.fileName}`);
    }

    generateAppRouter(files.map((f) => f.fileName).filter(Boolean), routersDir);

    console.log("tRPC routers generated successfully!");
  } catch (error) {
    console.error("Error generating tRPC routers:", error);
  }
}

async function generateTrpcServer(
  routersDir: string,
  templatesDir: string,
  swaggerUrl: string
) {
  await generateTrpcRouters(
    { swaggerUrl } as Config, // Ensure config structure matches expected types
    routersDir
  );
}

export { generateTrpcServer };
