export type Column = {
  fieldId: string;
  name: string;
  type: string | null;
  isPK: boolean;
  isNullable: boolean;
  isUnique: boolean;
  generatedId?: "autoincrement" | "uuid";
};

export type Table = {
  tableId: string;
  name: string;
  fields: Column[];
};

export type DraftField = {
  name: string;
  type: string;
  isPK: boolean;
  isNullable: boolean;
  isUnique: boolean;
  generatedId?: "autoincrement" | "uuid";
};
