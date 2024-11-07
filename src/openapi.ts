// OpenAPI TS Generator
import path from "node:path";
import { generateApi } from "swagger-typescript-api";
import { ensureDirExists } from "./helpers";
import { Config, defaultConfig } from "./types";

// Function to generate API with configuration
// Function to generate API with configuration
function generateApiClient(config: Config = defaultConfig) {
  // Ensure the directories exist
  ensureDirExists(config.generatedDir);

  // Create an absolute path for the output directory
  const outputDir = path.resolve(process.cwd(), config.generatedDir);

  return generateApi({
    name: config.apiName,
    output: outputDir, // Use the absolute path
    url: config.swaggerUrl,
    httpClientType: "fetch",
    generateClient: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: true,
    unwrapResponseData: true,
    prettier: {
      printWidth: 120,
      tabWidth: 2,
      trailingComma: "all",
      parser: "typescript",
    },
    templates: config.templatesDir,
  })
    .then(({ files }) => {
      files.forEach((file) => {
        // Create absolute path for each file
         
        
        
      });
      console.log("API files generated successfully.");
    })
    .catch((e) => {
      console.error("Error generating API:", e);
      throw e; // Re-throw the error for better error handling
    });
}

// Export the function
export { generateApiClient, Config };
