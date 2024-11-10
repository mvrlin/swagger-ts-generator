import fs from "node:fs";
import { z, ZodSchema } from "zod";
import { SchemaRegistry } from "./schema-registry";
export function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
// Helper function to safely convert schema to Zod
function convertToZodSchema(
  schema: any,
  dependencies: Set<string>,
  schemaRegistry: SchemaRegistry
): string {
  if (!schema) return "z.any()";

  try {
    // Handle references first
    if (schema.$ref) {
      const refName = schema.$ref.split("/").pop();
      if (!refName) {
        console.warn(`Invalid $ref format: ${schema.$ref}`);
        return "z.any()";
      }

      // Add to dependencies set
      dependencies.add(refName);
      
      // Get the referenced schema
      const importedSchema = schemaRegistry.get(refName);
      if (!importedSchema) {
        console.warn(`Schema reference not found: ${refName}`);
        return "z.any()";
      }

      // Prevent infinite recursion by checking if the imported schema is the same as the current one
      if (importedSchema === schema) {
        console.warn(`Circular reference detected for schema: ${refName}`);
        return "z.lazy(() => " + refName + ")";
      }

      return convertToZodSchema(importedSchema, dependencies, schemaRegistry);
    }

    switch (schema.type) {
      case "object": {
        if (!schema.properties) return "z.record(z.string(), z.any())";

        const properties = Object.entries(schema.properties)
          .map(([key, prop]: [string, any]) => {
            const isRequired = schema.required?.includes(key);
            const propertySchema = convertToZodSchema(prop, dependencies, schemaRegistry);
            const description = prop.description ? `.describe(${JSON.stringify(prop.description)})` : '';
            return `${key}: ${propertySchema}${isRequired ? "" : ".optional()"}${description}`;
          })
          .join(",\n    ");

        return `z.object({\n    ${properties}\n  })`;
      }

      case "array": {
        const itemSchema = convertToZodSchema(schema.items, dependencies, schemaRegistry);
        return `z.array(${itemSchema})`;
      }

      case "string": {
        let zodString = "z.string()";
        if (schema.enum) {
          return `z.enum([${schema.enum.map((e: string) => `"${e}"`).join(", ")}])`;
        }
        if (schema.format === "date-time") {
          zodString = "z.string().datetime()";
        }
        if (schema.format === "email") {
          zodString = "z.string().email()";
        }
        if (schema.minLength !== undefined) {
          zodString += `.min(${schema.minLength})`;
        }
        if (schema.maxLength !== undefined) {
          zodString += `.max(${schema.maxLength})`;
        }
        if (schema.pattern) {
          zodString += `.regex(new RegExp("${schema.pattern}"))`;
        }
        return zodString;
      }

      case "number":
      case "integer": {
        let zodNumber = schema.type === "integer" ? "z.number().int()" : "z.number()";
        if (schema.minimum !== undefined) {
          zodNumber += `.min(${schema.minimum})`;
        }
        if (schema.maximum !== undefined) {
          zodNumber += `.max(${schema.maximum})`;
        }
        if (schema.multipleOf !== undefined) {
          zodNumber += `.multipleOf(${schema.multipleOf})`;
        }
        return zodNumber;
      }

      case "boolean":
        return "z.boolean()";

      case "null":
        return "z.null()";

      default:
        if (schema.oneOf) {
          const unionSchemas = schema.oneOf.map((s: any) =>
            convertToZodSchema(s, dependencies, schemaRegistry)
          );
          return `z.union([${unionSchemas.join(", ")}])`;
        }
        if (schema.anyOf) {
          const unionSchemas = schema.anyOf.map((s: any) =>
            convertToZodSchema(s, dependencies, schemaRegistry)
          );
          return `z.union([${unionSchemas.join(", ")}])`;
        }
        if (schema.allOf) {
          const intersectionSchemas = schema.allOf.map((s: any) =>
            convertToZodSchema(s, dependencies, schemaRegistry)
          );
          return `z.intersection([${intersectionSchemas.join(", ")}])`;
        }
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
