export class SchemaRegistry {
  private schemas: Map<string, string> = new Map();
  private dependencies: Map<string, Set<string>> = new Map();

  add(name: string, schema: string, dependencies: Set<string> = new Set()) {
    this.schemas.set(this.normalizeSchemaName(name), schema);
    this.dependencies.set(this.normalizeSchemaName(name), dependencies);
  }

  get(name: string): string | undefined {
    return this.schemas.get(this.normalizeSchemaName(name));
  }

  private normalizeSchemaName(name: string): string {
    // Convert names like "Model.User" to "ModelUserSchema"
    return name.replace(/[^\w]/g, "") + "Schema";
  }

  NormalizeSchemaName(name: string): string {
    return name.replace(/[^\w]/g, "") + "Schema";
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

    for (const name of this.schemas.keys()) {
      visit(name);
    }

    return ordered;
  }

  exportSchema(name: string): string {
    return this.get(name) || "";
  }
}
