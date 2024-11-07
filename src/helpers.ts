import fs from "node:fs";
import { z, ZodSchema } from "zod";

export function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function convertToZodSchema(schema: any, parsedSchemas: any): string {
  if (!schema) return "z.any()";

  switch (schema.type) {
    case "string":
      if (schema.format === "date-time") {
        return `z.string().datetime()${schema.required ? "" : ".optional()"}`;
      }
      if (schema.format === "uuid") {
        return `z.string().uuid()${schema.required ? "" : ".optional()"}`;
      }
      if (schema.format === "email") {
        return `z.string().email()${schema.required ? "" : ".optional()"}`;
      }
      if (schema.format === "uri") {
        return `z.string().url()${schema.required ? "" : ".optional()"}`;
      }
      if (schema.enum) {
        const enumValues = schema.enum
          .map((value: any) => `'${value}'`)
          .join(" | ");
        return `z.enum([${enumValues}])${schema.required ? "" : ".optional()"}`;
      }
      return `z.string()${schema.required ? "" : ".optional()"}`;

    case "number":
    case "integer":
      if (schema.minimum !== undefined && schema.maximum !== undefined) {
        return `z.number().min(${schema.minimum}).max(${schema.maximum})${schema.required ? "" : ".optional()"}`;
      }
      if (schema.minimum !== undefined) {
        return `z.number().min(${schema.minimum})${schema.required ? "" : ".optional()"}`;
      }
      if (schema.maximum !== undefined) {
        return `z.number().max(${schema.maximum})${schema.required ? "" : ".optional()"}`;
      }
      return `z.number()${schema.required ? "" : ".optional()"}`;

    case "boolean":
      return `z.boolean()${schema.required ? "" : ".optional()"}`;

    case "array":
      if (schema.items.$ref) {
        const refType = schema.items.$ref.split("/").pop();
        return `z.array(z.lazy(() => ${refType}Schema))${schema.required ? "" : ".optional()"}`;
      }
      return `z.array(${convertToZodSchema(schema.items, parsedSchemas)})${schema.required ? "" : ".optional()"}`;

    case "object":
      if (!schema.properties) return "z.record(z.string(), z.any())";

      const properties = Object.entries(schema.properties)
        .map(([key, prop]: [string, any]) => {
          const required = schema.required?.includes(key);
          return `${key}: ${convertToZodSchema(prop, parsedSchemas)}${required ? "" : ".optional()"}`;
        })
        .join(",\n    ");

      return `z.object({\n    ${properties}\n  })`;

    default:
      if (schema.$ref) {
        const refType = schema.$ref.split("/").pop();
        if (parsedSchemas[refType]) {
          return `${refType}Schema`;
        }
        return `z.lazy(() => ${refType}Schema)`;
      }
      return "z.any()";
  }
}