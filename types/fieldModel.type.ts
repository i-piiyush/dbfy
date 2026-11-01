export type ITableDataField = {
  fieldId: string;
  name: string;
  type: string | null;
  isPK: boolean;
  isUnique: boolean;
  isNullable: boolean;
  generatedId?: "autoincrement" | "uuid";
  references?: { tableId: string; fieldId: string };
};

export type ITableData = {
  tableId: string;
  name: string;
  fields: ITableDataField[];
};

export type IField = {
  projectName: string;
  tableData: ITableData[];
  createdAt: Date;
  updatedAt: Date;
  userID: string;
};
