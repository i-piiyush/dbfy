// store/useProjectStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { Node, Edge, NodeChange, EdgeChange, Connection } from "@xyflow/react";

export type Field = {
  fieldId: string;
  name: string;
  type: string | null;
  isPK: boolean;
  isUnique: boolean;
  isNullable: boolean;
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

  // node/edge sync with react flow
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // table actions
  createTable: () => void;
  deleteTable: (tableId: string) => void;
  updateTableName: (tableId: string, name: string) => void;

  // field actions
  addField: (tableId: string) => void;
  updateField: (tableId: string, fieldId: string, updates: Partial<Field>) => void;
  deleteField: (tableId: string, fieldId: string) => void;
};

export const useProjectStore = create<ProjectStore>()(
  immer((set, get) => ({
    tables: [],
    nodes: [],
    edges: [],

    // react-flow's own helpers already return new arrays,
    // so plain assignment here is fine even inside immer.
    onNodesChange: (changes) =>
      set((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes);
      }),

    onEdgesChange: (changes) =>
      set((state) => {
        state.edges = applyEdgeChanges(changes, state.edges);
      }),

    onConnect: (connection) => {
      // stub — need to decide edge data shape first
    },

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
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
          data: {},
        });
      }),

    deleteTable: (tableId) =>
      set((state) => {
        state.tables = state.tables.filter((t) => t.tableId !== tableId);
        state.nodes = state.nodes.filter((n) => n.id !== tableId);
        // also drop any edges touching this table's node
        state.edges = state.edges.filter(
          (e) => e.source !== tableId && e.target !== tableId
        );
      }),

    updateTableName: (tableId, name) =>
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        if (table) table.name = name;
      }),

    addField: (tableId) =>
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        if (!table) return;
        table.fields.push({
          fieldId: crypto.randomUUID(),
          name: "",
          type: null,
          isPK: false,
          isUnique: false,
          isNullable: true,
        });
      }),

    updateField: (tableId, fieldId, updates) =>
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        const field = table?.fields.find((f) => f.fieldId === fieldId);
        if (field) Object.assign(field, updates);
      }),

    deleteField: (tableId, fieldId) =>
      set((state) => {
        const table = state.tables.find((t) => t.tableId === tableId);
        if (!table) return;
        table.fields = table.fields.filter((f) => f.fieldId !== fieldId);
      }),
  }))
);