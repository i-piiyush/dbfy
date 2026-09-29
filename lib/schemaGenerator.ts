import type { Field, Table } from "@/store/projectStore";

const PRISMA_TYPES: Record<string, string> = {
  UUID: "String @db.Uuid",
  String: "String",
  Int: "Int",
  Boolean: "Boolean",
  Float: "Float",
  DateTime: "DateTime",
  Json: "Json",
};

function toPrismaIdentifier(value: string, fallback: string): string {
  const words = value.match(/[A-Za-z0-9]+/g) ?? [];
  const identifier = words
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toLowerCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");

  if (!identifier) return fallback;
  return /^[A-Za-z_]/.test(identifier) ? identifier : `_${identifier}`;
}

function toModelName(value: string): string {
  const words = value.match(/[A-Za-z0-9]+/g) ?? [];
  const modelName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  if (!modelName) return "Table";
  return /^[A-Za-z_]/.test(modelName) ? modelName : `_${modelName}`;
}

function uniqueRelationFieldName(
  baseName: string,
  relatedFieldName: string,
  usedNames: Set<string>,
): string {
  let candidate = baseName;
  if (usedNames.has(candidate)) {
    const suffix = toPrismaIdentifier(relatedFieldName, "field");
    candidate = `${baseName}By${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
  }
  let counter = 2;
  while (usedNames.has(candidate)) candidate = `${baseName}${counter++}`;
  usedNames.add(candidate);
  return candidate;
}

function fieldToPrisma(field: Field, inlinePrimaryKey: boolean): string {
  const prismaType = field.type ? PRISMA_TYPES[field.type] ?? "String" : "String";
  const [baseType, nativeType] = prismaType.split(" ");
  const optional = field.isNullable && !field.isPK ? "?" : "";
  const attributes = [
    nativeType,
    field.isPK && inlinePrimaryKey ? "@id" : "",
    field.isUnique && !field.isPK ? "@unique" : "",
    field.name !== toPrismaIdentifier(field.name, "field")
      ? `@map("${field.name.replaceAll('"', '\\"')}")`
      : "",
  ].filter(Boolean);

  return `  ${toPrismaIdentifier(field.name, "field")} ${baseType}${optional}${attributes.length ? ` ${attributes.join(" ")}` : ""}`;
}

function tableToPrisma(table: Table, tables: Table[]): string {
  const primaryKeys = table.fields.filter((field) => field.isPK);
  const fields = table.fields.map((field) =>
    fieldToPrisma(field, primaryKeys.length === 1),
  );
  const usedFieldNames = new Set(
    table.fields.map((field) => toPrismaIdentifier(field.name, "field")),
  );
  if (primaryKeys.length > 1) {
    fields.push(
      `  @@id([${primaryKeys.map((field) => toPrismaIdentifier(field.name, "field")).join(", ")}])`,
    );
  }
  const modelName = toModelName(table.name);

  for (const field of table.fields) {
    if (!field.references) continue;
    const sourceTable = tables.find((candidate) => candidate.tableId === field.references?.tableId);
    const sourceField = sourceTable?.fields.find((candidate) => candidate.fieldId === field.references?.fieldId);
    if (!sourceTable || !sourceField) continue;

    const sourceModel = toModelName(sourceTable.name);
    const sourceRelationField = uniqueRelationFieldName(
      toPrismaIdentifier(sourceTable.name, "table"),
      field.name,
      usedFieldNames,
    );
    const relationName = `${sourceModel}_${modelName}_${toPrismaIdentifier(sourceField.name, "field")}_${toPrismaIdentifier(field.name, "field")}`;
    const relationOptional = field.isNullable && !field.isPK ? "?" : "";

    fields.push(
      `  ${sourceRelationField}${relationOptional} ${sourceModel} @relation("${relationName}", fields: [${toPrismaIdentifier(field.name, "field")}], references: [${toPrismaIdentifier(sourceField.name, "field")}])`,
    );
  }

  const incomingRelations: string[] = [];
  for (const targetTable of tables) {
    for (const field of targetTable.fields) {
      if (field.references?.tableId !== table.tableId) continue;
      const sourceField = table.fields.find((candidate) => candidate.fieldId === field.references?.fieldId);
      if (!sourceField) continue;
      const targetModel = toModelName(targetTable.name);
      const targetUnique = field.isPK || field.isUnique;
      const relationName = `${modelName}_${targetModel}_${toPrismaIdentifier(sourceField.name, "field")}_${toPrismaIdentifier(field.name, "field")}`;
      const reverseField = uniqueRelationFieldName(
        toPrismaIdentifier(targetTable.name, "table"),
        field.name,
        usedFieldNames,
      );
      incomingRelations.push(
        `  ${reverseField} ${targetModel}${targetUnique ? "?" : "[]"} @relation("${relationName}")`,
      );
    }
  }
  fields.push(...incomingRelations);

  if (table.name !== modelName) {
    fields.push(`\n  @@map("${table.name.replaceAll('"', '\\"')}")`);
  }

  return `model ${modelName} {\n${fields.join("\n")}\n}`;
}

export function generatePrismaSchema(tables: Table[]): string {
  return tables.map((table) => tableToPrisma(table, tables)).join("\n\n");
}

const SQL_TYPES: Record<string, string> = {
  UUID: "UUID",
  String: "TEXT",
  Int: "INTEGER",
  Boolean: "BOOLEAN",
  Float: "DOUBLE PRECISION",
  DateTime: "TIMESTAMP",
  Json: "JSONB",
};

function quoteSqlIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function fieldToSql(field: Field): string {
  const type = field.type ? SQL_TYPES[field.type] ?? "TEXT" : "TEXT";
  const constraints = [
    field.isPK ? "PRIMARY KEY" : "",
    field.isUnique && !field.isPK ? "UNIQUE" : "",
    !field.isNullable || field.isPK ? "NOT NULL" : "",
  ].filter(Boolean);

  return `  ${quoteSqlIdentifier(field.name)} ${type}${constraints.length ? ` ${constraints.join(" ")}` : ""}`;
}

export function generateSqlSchema(tables: Table[]): string {
  return tables.map((table) => {
    const primaryKeys = table.fields.filter((field) => field.isPK);
    const columns = table.fields.map(fieldToSql);

    if (primaryKeys.length > 1) {
      columns.push(`  PRIMARY KEY (${primaryKeys.map((field) => quoteSqlIdentifier(field.name)).join(", ")})`);
    }

    for (const field of table.fields) {
      if (!field.references) continue;
      const referencedTable = tables.find((candidate) => candidate.tableId === field.references?.tableId);
      const referencedField = referencedTable?.fields.find((candidate) => candidate.fieldId === field.references?.fieldId);
      if (!referencedTable || !referencedField) continue;

      columns.push(
        `  FOREIGN KEY (${quoteSqlIdentifier(field.name)}) REFERENCES ${quoteSqlIdentifier(referencedTable.name)} (${quoteSqlIdentifier(referencedField.name)})`,
      );
    }

    return `CREATE TABLE ${quoteSqlIdentifier(table.name)} (\n${columns.join(",\n")}\n);`;
  }).join("\n\n");
}
