/** Field data shared by the canvas, schema generators, and stored projects. */
export type SchemaField = {
  fieldId: string;
  name: string;
  type: string | null;
  isPK: boolean;
  isNullable: boolean;
  isUnique: boolean;
  generatedId?: "autoincrement" | "uuid";
  references?: { tableId: string; fieldId: string };
};

export type SchemaTable = {
  tableId: string;
  name: string;
  fields: SchemaField[];
};

export type DraftField = Omit<SchemaField, "fieldId" | "references"> & {
  type: string;
};
