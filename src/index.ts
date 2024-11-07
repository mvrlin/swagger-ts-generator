import { generateApiClient } from "./openapi";
import dotenv from "dotenv";
import path from "path";
import { generateTrpcClient } from "./trpc-client-generator";
import fs from "fs";

// Try multiple possible .env locations
const possibleEnvPaths = [
  path.resolve(process.cwd(), "example/.env"), // Add example directory path
  path.resolve(process.cwd(), ".env"), // Current directory
  path.resolve(process.cwd(), "../.env"), // One level up
  path.resolve(process.cwd(), "../../.env"), // Two levels up
  path.resolve(process.cwd(), "../../../.env"), // Three levels up
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  console.log("Trying .env file at:", envPath);
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    envLoaded = true;
    console.log("Successfully loaded .env from:", envPath);
    break;
  }
}

if (!envLoaded) {
  console.warn(
    "No .env file found. Checking for environment variables directly..."
  );
}

// Add debug logging for environment variables
console.log("Environment variables loaded:", {
  GENERATED_DIR: process.env.GENERATED_DIR,
  SWAGGER_URL: process.env.SWAGGER_URL,
  API_NAME: process.env.API_NAME,
});

if (
  !process.env.GENERATED_DIR ||
  !process.env.SWAGGER_URL ||
  !process.env.API_NAME
) {
  // !TODO: create/add env vars
  throw new Error("GENERATED_DIR, SWAGGER_URL and API_NAME must be set");
}

// Convert relative path to absolute path relative to the project root
const projectRoot = path.resolve(process.cwd(), "../../");
const absoluteGeneratedDir = path.resolve(
  projectRoot,
  process.env.GENERATED_DIR!
);

generateApiClient({
  apiName: process.env.API_NAME,
  generatedDir: absoluteGeneratedDir,
  swaggerUrl: process.env.SWAGGER_URL,
});


let trpcRoot = path.resolve(projectRoot, "./src");
if (!fs.existsSync(trpcRoot)) {
  trpcRoot = projectRoot;
}

generateTrpcClient(trpcRoot);

console.log(`API files generated successfully. 
    Generated directory: ${process.env.GENERATED_DIR}
    Swagger URL: ${process.env.SWAGGER_URL}
    API Name: ${process.env.API_NAME}
    `);

export { generateApiClient };