import path from "node:path";

// Configuration object
interface Config {
  generatedDir: string;
  templatesDir?: string;
  swaggerUrl: string;
  apiName: string;
}

const defaultConfig: Config = {
  generatedDir: path.resolve(process.cwd(), "./src/__generated__"),
  templatesDir: path.resolve(process.cwd(), "./src/templates"),
  swaggerUrl:
    process.env.SWAGGER_URL ||
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/swagger/doc.json`,
  apiName: "MySuperbApi",
};

export { Config, defaultConfig };
