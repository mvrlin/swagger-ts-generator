import { generateApiClient } from "./openapi";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

generateApiClient(
  {
    apiName: "LajitApi",
    generatedDir: "./__generated__",
    swaggerUrl: "https://back.lajit.com/swagger/doc.json",
  }
);

console.log("Hello, world!");