// store/useProjectStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";

export type Field = {
  fieldId: string;
  name: string;
  type: string | null;
  isPK: boolean;
  isUnique: boolean;
  isNullable: boolean;
  generatedId?: "autoincrement" | "uuid";
  references?: { tableId: string; fieldId: string };
};

export type Table = {
  tableId: string;
  name: string;
  fields: Field[];
};

type ProjectStore = {
  tables: Table[];
  nodes: Node[];
  edges: Edge[];
  projectError: string | null;

  // node/edge sync with react flow
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // table actions
  createTable: () => void;
  deleteTable: (tableId: string) => void;
  updateTableName: (tableId: string, name: string) => void;

  // field actions
  addField: (tableId: string, fieldData?: Partial<Field>) => boolean;
  updateField: (
    tableId: string,
    fieldId: string,
    updates: Partial<Field>,
  ) => boolean;
  deleteField: (tableId: string, fieldId: string) => void;
};

export const useProjectStore = create<ProjectStore>()(
  immer((set, _get) => ({
    tables: [],
    nodes: [],
    edges: [],
    projectError: null,

    // react-flow's own helpers already return new arrays,
    // so plain assignment here is fine even inside immer.
    onNodesChange: (changes) =>
      set((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes);
      }),

    onEdgesChange: (changes) =>
      set((state) => {
        for (const change of changes) {
          if (change.type !== "remove") continue;
          const removedEdge = state.edges.find((edge) => edge.id === change.id);
          const targetFieldId = removedEdge?.targetHandle?.replace("target:", "");
          const targetTable = state.tables.find((table) => table.tableId === removedEdge?.target);
          const targetField = targetTable?.fields.find((field) => field.fieldId === targetFieldId);
          if (targetField?.references) delete targetField.references;
        }
        state.edges = applyEdgeChanges(changes, state.edges);
      }),

    onConnect: (connection) =>
      set((state) => {
        const fail = (message: string) => {
          state.projectError = message;
        };
        if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
          fail("Connect a field handle on each table.");
          return;
        }

        const sourceFieldId = connection.sourceHandle.replace("source:", "");
        const targetFieldId = connection.targetHandle.replace("target:", "");
        const sourceTable = state.tables.find((table) => table.tableId === connection.source);
        const targetTable = state.tables.find((table) => table.tableId === connection.target);
        const sourceField = sourceTable?.fields.find((field) => field.fieldId === sourceFieldId);
        const targetField = targetTable?.fields.find((field) => field.fieldId === targetFieldId);

        if (!sourceTable || !targetTable || !sourceField || !targetField) {
          fail("The selected table or field no longer exists. Try connecting again.");
          return;
        }
        if (sourceTable.tableId === targetTable.tableId && sourceField.fieldId === targetField.fieldId) {
          fail("A field cannot reference itself.");
          return;
        }
        if (!sourceField.name.trim() || !targetField.name.trim()) {
          fail("Name both fields before connecting them.");
          return;
        }
        if (!sourceField.isPK && !sourceField.isUnique) {
          fail("The referenced field must be a primary key or unique.");
          return;
        }
        if (!sourceField.type || !targetField.type) {
          fail("Choose a data type for both fields before connecting them.");
          return;
        }
        if (sourceField.type !== targetField.type) {
          fail("Connected fields must have the same data type.");
          return;
        }
        if (targetField.references) {
          fail("This field already references another field. Remove that connection first.");
          return;
        }
        if (state.edges.some((edge) => edge.sourceHandle === connection.sourceHandle && edge.targetHandle === connection.targetHandle)) {
          fail("These fields are already connected.");
          return;
        }

        targetField.references = { tableId: sourceTable.tableId, fieldId: sourceField.fieldId };
        state.edges = addEdge(connection, state.edges);
        state.projectError = null;
      }),

    createTable: () =>
      set((state) => {
        const tableId = crypto.randomUUID();

        const defaultField: Field = {
          fieldId: crypto.randomUUID(),
          name: "",
          type: null,
          isPK: false,
          isUnique: false,
          isNullable: true,
        };

        state.tables.push({
          tableId,
          name: "NewTable",
          fields: [defaultField],
        });

        state.nodes.push({
          id: tableId,
          type: "tableNode",
          position: {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
          },
          data: {},
        });
      }),

    deleteTable: (tableId) =>
      set((state) => {
        state.tables = state.tables.filter((t) => t.tableId !== tableId);
        for (const table of state.tables) {
          for (const field of table.fields) {
            if (field.references?.tableId === tableId) delete field.references;
          }
        }
        state.nodes = state.nodes.filter((n) => n.id !== tableId);
        // also drop any edges touching this table's node
        state.edges = state.edges.filter(
          (e) => e.source !== tableId && e.target !== tableId,
        );
      }),

    updateTableName: (tableId, name) =>
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        if (table) table.name = name;
      }),

    addField: (tableId, fieldData) => {
      let added = false;
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        if (!table) return;
        const normalizedName = (fieldData?.name ?? "").trim().toLowerCase();
        if (table.fields.some((field) => field.name.trim().toLowerCase() === normalizedName)) {
          state.projectError = "Field names must be unique within a table, regardless of case.";
          return;
        }
        if (fieldData?.isPK && table.fields.some((field) => field.isPK)) {
          state.projectError = "Each table can have only one primary key field.";
          return;
        }
        table.fields.push({
          fieldId: crypto.randomUUID(),
          name: (fieldData?.name ?? "").trim(),
          type: fieldData?.type ?? null,
          isPK: fieldData?.isPK ?? false,
          isUnique: fieldData?.isUnique ?? false,
          isNullable: fieldData?.isNullable ?? true,
          generatedId: fieldData?.generatedId,
        });
        state.projectError = null;
        added = true;
      });
      return added;
    },

    updateField: (tableId, fieldId, updates) => {
      let updated = false;
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        const field = table?.fields.find((f) => f.fieldId === fieldId);
        if (!field) return;

        const nextField = { ...field, ...updates };
        const normalizedName = (nextField.name ?? "").trim().toLowerCase();
        if (table.fields.some((candidate) =>
          candidate.fieldId !== fieldId &&
          candidate.name.trim().toLowerCase() === normalizedName
        )) {
          state.projectError = "Field names must be unique within a table, regardless of case.";
          return;
        }
        if (
          updates.isPK === true &&
          table?.fields.some((candidate) => candidate.fieldId !== fieldId && candidate.isPK)
        ) {
          state.projectError = "Each table can have only one primary key field.";
          return;
        }
        const isReferenced = state.tables.some((candidate) =>
          candidate.fields.some(
            (candidateField) =>
              candidateField.references?.tableId === tableId &&
              candidateField.references.fieldId === fieldId,
          ),
        );
        if (isReferenced && !nextField.isPK && !nextField.isUnique) {
          state.projectError = "A referenced field must remain a primary key or unique.";
          return;
        }
        const referencingField = state.tables
          .flatMap((candidate) => candidate.fields)
          .find(
            (candidateField) =>
              candidateField.references?.tableId === tableId &&
              candidateField.references.fieldId === fieldId,
          );
        if (referencingField && nextField.type !== referencingField.type) {
          state.projectError = "A referenced field and its foreign key must keep the same data type.";
          return;
        }
        if (
          field.references &&
          nextField.type !==
            state.tables
              .find((candidate) => candidate.tableId === field.references?.tableId)
              ?.fields.find((candidateField) => candidateField.fieldId === field.references?.fieldId)?.type
        ) {
          state.projectError = "A foreign key and its referenced field must keep the same data type.";
          return;
        }

        Object.assign(field, updates);
        state.projectError = null;
        updated = true;
      });
      return updated;
    },

    deleteField: (tableId, fieldId) =>
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        if (!table) return;
        table.fields = table.fields.filter((f) => f.fieldId !== fieldId);
        for (const otherTable of state.tables) {
          for (const field of otherTable.fields) {
            if (field.references?.tableId === tableId && field.references.fieldId === fieldId) {
              delete field.references;
            }
          }
        }
        state.edges = state.edges.filter((edge) => {
          const removesOutgoing = edge.source === tableId && edge.sourceHandle === `source:${fieldId}`;
          const removesIncoming = edge.target === tableId && edge.targetHandle === `target:${fieldId}`;
          return !removesOutgoing && !removesIncoming;
        });
      }),
  })),
);


