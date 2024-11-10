interface SchemaDefinition {
  name: string;
  schema: string;
  dependencies: Set<string>;
}

class SchemaRegistry {
  private schemas: Map<string, SchemaDefinition> = new Map();

  add(name: string, schema: string, dependencies: Set<string> = new Set()) {
    this.schemas.set(name, { name, schema, dependencies });
  }

  get(name: string): SchemaDefinition | undefined {
    return this.schemas.get(name);
  }

  getOrderedSchemas(): SchemaDefinition[] {
    const visited = new Set<string>();
    const output: SchemaDefinition[] = [];

    const visit = (name: string) => {
      if (visited.has(name)) return;
      const schema = this.schemas.get(name);
      if (!schema) return;

      visited.add(name);
      schema.dependencies.forEach((dep) => visit(dep));
      output.push(schema);
    };

    this.schemas.forEach((_, name) => visit(name));
    return output;
  }
}

export default SchemaRegistry;