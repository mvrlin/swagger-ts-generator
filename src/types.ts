import path from "node:path";

// Configuration object
interface Config {
  generatedDir: string;
  templatesDir?: string;
  swaggerUrl: string;
  apiName: string;
}
interface RouteConfig {
  name: string;
  description: string;
  procedures: ProcedureConfig[];
}

interface ProcedureConfig {
  name: string;
  type: "query" | "mutation";
  parameters: ParameterConfig[];
  body: { schema: string } | null;
  response: { schema: string } | null;
  description: string;
}

interface ParameterConfig {
  name: string;
  type: string;
  required: boolean;
  schema: string;
}

const defaultConfig: Config = {
  generatedDir: path.resolve(process.cwd(), "./src/__generated__"),
  templatesDir: path.resolve(process.cwd(), "./src/templates"),
  swaggerUrl:
    process.env.SWAGGER_URL ||
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/swagger/doc.json`,
  apiName: "MySuperbApi",
};
// Type definitions for router generation
interface RouteConfig {
  name: string;
  description: string;
  procedures: ProcedureConfig[];
}

interface ProcedureConfig {
  name: string;
  type: "query" | "mutation";
  parameters: ParameterConfig[];
  body: { schema: string } | null;
  response: { schema: string } | null;
  description: string;
}

interface ParameterConfig {
  name: string;
  type: string;
  required: boolean;
  schema: string;
}
export { Config, defaultConfig, RouteConfig, ProcedureConfig, ParameterConfig };
