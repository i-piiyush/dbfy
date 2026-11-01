import type { Edge, Node } from "@xyflow/react";
import type { SchemaTable } from "@/types/schema";

/** Creates the canvas nodes and reference edges for saved tables. */
export function buildProjectGraph(tables: SchemaTable[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = tables.map((table, index) => ({
    id: table.tableId,
    type: "tableNode",
    position: { x: (index % 3) * 360 + 80, y: Math.floor(index / 3) * 320 + 80 },
    data: {},
  }));
  const edges: Edge[] = tables.flatMap((table) =>
    table.fields.flatMap((field) => field.references
      ? [{
          id: `${field.references.tableId}:${field.references.fieldId}->${table.tableId}:${field.fieldId}`,
          source: field.references.tableId,
          sourceHandle: `source:${field.references.fieldId}`,
          target: table.tableId,
          targetHandle: `target:${field.fieldId}`,
        }]
      : []),
  );

  return { nodes, edges };
}
