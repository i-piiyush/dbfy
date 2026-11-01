import { z } from "zod";

const fieldTypes = [
  "String",
  "Int",
  "BigInt",
  "Decimal",
  "Float",
  "Boolean",
  "DateTime",
  "UUID",
  "Json",
  "String[]",
  "Text",
  "VarChar",
  "Date",
  "Timestamp",
  "Timestamptz",
] as const;

const fieldSchema = z.object({
  fieldId: z.string().trim().min(1).max(128),
  name: z.string().trim().min(1, "Field names cannot be empty.").max(128),
  type: z.enum(fieldTypes).nullable(),
  isPK: z.boolean(),
  isUnique: z.boolean(),
  isNullable: z.boolean(),
  generatedId: z.enum(["autoincrement", "uuid"]).optional(),
  references: z.object({
    tableId: z.string().trim().min(1).max(128),
    fieldId: z.string().trim().min(1).max(128),
  }).strict().optional(),
}).strict();

const tableSchema = z.object({
  tableId: z.string().trim().min(1).max(128),
  name: z.string().trim().min(1, "Table names cannot be empty.").max(128),
  fields: z.array(fieldSchema).max(100, "A table cannot contain more than 100 fields."),
}).strict();

export const saveTableSchema = z.object({
  projectId: z.string().regex(/^[a-f\d]{24}$/i, "Project ID must be a valid database ID."),
  tableData: z.array(tableSchema).max(100, "A project cannot contain more than 100 tables."),
}).strict().superRefine(({ tableData }, context) => {
  const tableIds = new Set<string>();
  const tableNames = new Set<string>();

  for (const [tableIndex, table] of tableData.entries()) {
    const normalizedTableName = table.name.toLocaleLowerCase();
    if (tableIds.has(table.tableId)) {
      context.addIssue({ code: "custom", path: ["tableData", tableIndex, "tableId"], message: "Table IDs must be unique." });
    }
    if (tableNames.has(normalizedTableName)) {
      context.addIssue({ code: "custom", path: ["tableData", tableIndex, "name"], message: "Table names must be unique, regardless of case." });
    }
    tableIds.add(table.tableId);
    tableNames.add(normalizedTableName);

    const fieldIds = new Set<string>();
    const fieldNames = new Set<string>();
    let primaryKeyCount = 0;
    for (const [fieldIndex, field] of table.fields.entries()) {
      const issuePath = ["tableData", tableIndex, "fields", fieldIndex];
      if (fieldIds.has(field.fieldId)) {
        context.addIssue({ code: "custom", path: [...issuePath, "fieldId"], message: "Field IDs must be unique within a table." });
      }
      if (fieldNames.has(field.name.toLocaleLowerCase())) {
        context.addIssue({ code: "custom", path: [...issuePath, "name"], message: "Field names must be unique within a table, regardless of case." });
      }
      fieldIds.add(field.fieldId);
      fieldNames.add(field.name.toLocaleLowerCase());

      if (field.isPK) primaryKeyCount += 1;
      if (field.generatedId === "autoincrement" && field.type !== "Int" && field.type !== "BigInt") {
        context.addIssue({ code: "custom", path: [...issuePath, "generatedId"], message: "Autoincrement fields must use Int or BigInt." });
      }
      if (field.generatedId === "uuid" && field.type !== "UUID") {
        context.addIssue({ code: "custom", path: [...issuePath, "generatedId"], message: "UUID generated fields must use the UUID type." });
      }
      if (field.references) {
        const targetTable = tableData.find((candidate) => candidate.tableId === field.references?.tableId);
        const targetField = targetTable?.fields.find((candidate) => candidate.fieldId === field.references?.fieldId);
        if (!targetTable || !targetField) {
          context.addIssue({ code: "custom", path: [...issuePath, "references"], message: "A reference must point to an existing table and field." });
        } else {
          if (table.tableId === targetTable.tableId && field.fieldId === targetField.fieldId) {
            context.addIssue({ code: "custom", path: [...issuePath, "references"], message: "A field cannot reference itself." });
          }
          if (!targetField.isPK && !targetField.isUnique) {
            context.addIssue({ code: "custom", path: [...issuePath, "references"], message: "A referenced field must be a primary key or unique." });
          }
          if (!field.type || !targetField.type || field.type !== targetField.type) {
            context.addIssue({ code: "custom", path: [...issuePath, "references"], message: "A reference and its target must have the same non-empty data type." });
          }
        }
      }
    }

    if (primaryKeyCount > 1) {
      context.addIssue({ code: "custom", path: ["tableData", tableIndex, "fields"], message: "A table can have only one primary key field." });
    }
  }
});

export type SaveProjectInput = z.infer<typeof saveTableSchema>;
