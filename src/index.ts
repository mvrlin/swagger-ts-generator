import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { generateApiClient } from "./openapi";
import { generateTrpcClient } from "./trpc-client-generator";

// Dependencies to be installed
const dependencies = {
  "@tanstack/react-query": "^4.18.0",
  "@trpc/react-query": "^10.45.2",
  "swagger-ts-generator": "Noboxer/swagger-ts-generator#main",
};

// Ensure src/__generated__ directory exists
const generatedDir = path.join(process.cwd(), "src", "__generated__");
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// Create .env if it doesn't exist
const envPath = path.join(process.cwd(), ".env");
const envContent = `
GENERATED_DIR=./src/__generated__
SWAGGER_URL=xxxx/swagger/doc.json 
API_NAME=xxx
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent.trim());
  console.log("Created .env file");
}

// Install dependencies
console.log("Installing dependencies...");
Object.entries(dependencies).forEach(([dep, version]) => {
  try {
    execSync(`yarn add ${dep}@${version}`, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to install ${dep}: ${error}`);
  }
});

// Load environment variables from possible locations
const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../../../.env"),
].map((p) => ({ path: p, label: path.relative(process.cwd(), p) }));

let envLoaded = false;
for (const { path: envPath, label } of possibleEnvPaths) {
  console.log(`Checking .env at: ${label}`);
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    envLoaded = true;
    console.log(`Loaded .env from: ${label}`);
    break;
  }
}

if (!envLoaded) {
  console.warn("No .env file found. Using environment variables directly...");
}

// Required environment variables
const requiredEnvVars = {
  GENERATED_DIR: process.env.GENERATED_DIR,
  SWAGGER_URL: process.env.SWAGGER_URL,
  API_NAME: process.env.API_NAME,
} as const;

// Validate environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

// Resolve paths
const projectRoot = path.resolve(process.cwd(), "../../");
const srcDir = path.resolve(projectRoot, "src");

// Determine generated directory - if src exists, use it as base path
const baseDir = fs.existsSync(srcDir) ? srcDir : projectRoot;
const trpcRoot = fs.existsSync(srcDir) ? srcDir : projectRoot;

// Generate clients
generateApiClient({
  apiName: requiredEnvVars.API_NAME!,
  generatedDir,
  swaggerUrl: requiredEnvVars.SWAGGER_URL!,
});

generateTrpcClient(trpcRoot);

// generate the server
console.log(`
API files generated successfully:
  Generated directory: ${generatedDir}
  Swagger URL: ${requiredEnvVars.SWAGGER_URL}
  API Name: ${requiredEnvVars.API_NAME}
`);

export { generateApiClient };
