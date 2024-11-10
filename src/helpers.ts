import fs from "node:fs";
import { z, ZodSchema } from "zod";
import { SchemaRegistry } from "./schema-registry";
export function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
// Helper function to safely convert schema to Zod
function convertToZodSchema(schema: any, dependencies: Set<string>): string {
  if (!schema) return "z.any()";

  try {
    if (schema.$ref) {
      const refName = schema.$ref.split("/").pop();
      if (refName) {
        dependencies.add(refName);
        return `z.lazy(() => ${refName}Schema)`;
      }
    }

    switch (schema.type) {
      case "object": {
        if (!schema.properties) return "z.record(z.string(), z.any())";

        const properties = Object.entries(schema.properties)
          .map(([key, prop]: [string, any]) => {
            const isRequired = schema.required?.includes(key);
            const propertySchema = convertToZodSchema(prop, dependencies);
            return `${key}: ${propertySchema}${isRequired ? "" : ".optional()"}`;
          })
          .join(",\n    ");

        return `z.object({\n    ${properties}\n  })`;
      }

      case "array": {
        const itemSchema = convertToZodSchema(schema.items, dependencies);
        return `z.array(${itemSchema})`;
      }

      case "string":
      case "number":
      case "boolean":
        return `z.${schema.type}()`;

      default:
        return "z.any()";
    }
  } catch (error) {
    console.warn("Error converting schema to Zod:", error);
    return "z.any()";
  }
}

function getSchemaName(originalSchema: any, parsedSchema: any): string | null {
  // Try to get name from various sources
  const name =
    parsedSchema?.name ||
    originalSchema?.title ||
    (originalSchema?.$ref && originalSchema.$ref.split("/").pop()) ||
    null;

  if (!name) return null;

  // Clean the name
  return name
    .replace(/[^\w]/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
export { getSchemaName, convertToZodSchema, camelCase };
