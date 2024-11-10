export class SchemaRegistry {
  private schemas: Map<string, string> = new Map();
  private dependencies: Map<string, Set<string>> = new Map();

  add(name: string, schema: string, dependencies: Set<string> = new Set()) {
    const normalizedName = this.normalizeSchemaName(name);
    if (!normalizedName) return;

    // Remove duplicate "Schema" suffixes
    const schemaName = normalizedName.endsWith("Schema")
      ? normalizedName
      : `${normalizedName}Schema`;

    this.schemas.set(schemaName, schema);
    this.dependencies.set(schemaName, dependencies);
  }

  get(name: string): string | undefined {
    const normalizedName = this.normalizeSchemaName(name);
    return normalizedName ? this.schemas.get(normalizedName) : undefined;
  }

  normalizeSchemaName(input: any): string | undefined {
    if (!input) return undefined;

    let name: string;
    if (typeof input === "string") {
      name = input;
    } else if (typeof input === "object") {
      if (input.$ref) {
        const parts = input.$ref.split("/");
        name = parts[parts.length - 1];
      } else if (input.title) {
        name = input.title;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }

    // Handle fully qualified names (e.g. "Model.User" or "data.ErrorResponse")
    const parts = name.split(/[^\w]+/);

    // Properly capitalize parts
    const normalized = parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    return normalized;
  }

  getOrderedSchemas(): Array<{ name: string; schema: string }> {
    const visited = new Set<string>();
    const ordered: Array<{ name: string; schema: string }> = [];

    const visit = (name: string) => {
      if (visited.has(name)) return;
      visited.add(name);

      const deps = this.dependencies.get(name) || new Set();
      for (const dep of deps) {
        visit(dep);
      }

      const schema = this.schemas.get(name);
      if (schema) {
        ordered.push({ name, schema });
      }
    };

    // Sort schema names for consistent ordering
    const sortedNames = Array.from(this.schemas.keys()).sort();
    for (const name of sortedNames) {
      visit(name);
    }

    return ordered;
  }
}
