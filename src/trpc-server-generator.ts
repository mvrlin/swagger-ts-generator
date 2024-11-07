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
        onCreateRoute: (routeData) => {
          const routeName = routeData.routeName.original;
          let route = routes.find((r) => r.name === routeName);

          if (!route) {
            route = {
              name: routeName,
              description: "",
              procedures: [],
            };
            routes.push(route);
          }

          const procedureType =
            routeData.request.method === "get" ? "query" : "mutation";
          const procedureName = routeData.id;
          const parameters: ParameterConfig[] = [];
          const body = null;
          const response = null;

          route.procedures.push({
            name: procedureName,
            type: procedureType,
            parameters,
          });

          return routeData;
        },
      },
    });

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
