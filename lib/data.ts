export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  UUID: { bg: "bg-zinc-100", text: "text-zinc-500" },
  String: { bg: "bg-blue-50", text: "text-blue-500" },
  Int: { bg: "bg-orange-50", text: "text-orange-500" },
  Boolean: { bg: "bg-green-50", text: "text-green-600" },
  Float: { bg: "bg-yellow-50", text: "text-yellow-600" },
  DateTime: { bg: "bg-purple-50", text: "text-purple-500" },
  Json: { bg: "bg-pink-50", text: "text-pink-500" },
};

export type SchemaFormat = "sql" | "prisma";

export const PRISMA_DATATYPES = [
  "String", "Int", "BigInt", "Decimal", "Float", "Boolean",
  "DateTime", "UUID", "Json", "String[]",
];

// Values are stable internal type identifiers; labels are what the editor shows.
export const SQL_DATATYPES = [
  { value: "Text", label: "TEXT" },
  { value: "VarChar", label: "VARCHAR(n)" },
  { value: "Int", label: "INTEGER" },
  { value: "BigInt", label: "BIGINT" },
  { value: "Decimal", label: "DECIMAL / NUMERIC" },
  { value: "Float", label: "DOUBLE PRECISION" },
  { value: "Boolean", label: "BOOLEAN" },
  { value: "Date", label: "DATE" },
  { value: "Timestamp", label: "TIMESTAMP" },
  { value: "Timestamptz", label: "TIMESTAMPTZ" },
  { value: "UUID", label: "UUID" },
  { value: "Json", label: "JSONB" },
  { value: "String[]", label: "TEXT[]" },
];
