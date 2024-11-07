import { generateApiClient } from "./openapi";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file in the executing package's directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (
  !process.env.GENERATED_DIR ||
  !process.env.SWAGGER_URL ||
  !process.env.API_NAME
) {
  throw new Error("GENERATED_DIR, SWAGGER_URL and API_NAME must be set");
}

generateApiClient({
  apiName: process.env.API_NAME,
  generatedDir: process.env.GENERATED_DIR,
  swaggerUrl: process.env.SWAGGER_URL,
});

console.log(`API files generated successfully. 
    Generated directory: ${process.env.GENERATED_DIR}
    Swagger URL: ${process.env.SWAGGER_URL}
    API Name: ${process.env.API_NAME}
    `);
