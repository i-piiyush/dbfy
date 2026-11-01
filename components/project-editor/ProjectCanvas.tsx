"use client";

import { Background, Controls, Panel, ReactFlow } from "@xyflow/react";
import { motion } from "motion/react";
import TableNode from "@/components/TableNode";
import { SchemaFormatContext } from "@/components/SchemaFormatContext";
import type { SchemaFormat } from "@/lib/schema-options";
import type { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";

const nodeTypes = { tableNode: TableNode };

type ProjectCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  schemaFormat: SchemaFormat;
  saving: boolean;
  hasUnsavedChanges: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onFormatChange: (format: SchemaFormat) => void;
  onSave: () => void;
};

export default function ProjectCanvas({
  nodes,
  edges,
  schemaFormat,
  saving,
  hasUnsavedChanges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onFormatChange,
  onSave,
}: ProjectCanvasProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-y-0 left-18 right-0 h-full md:left-64">
      <SchemaFormatContext.Provider value={schemaFormat}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
        >
          <Background color="var(--palette-grid)" gap={24} size={1} />
          <Controls />
          <Panel position="top-right">
            <div role="group" aria-label="Database schema format" className="inline-flex border-2 border-ink bg-canvas p-1 shadow-[3px_3px_0_var(--palette-ink)]">
              {([
                ["sql", "SQL Schema"],
                ["prisma", "Prisma Schema"],
              ] as const).map(([format, label]) => (
                <button
                  key={format}
                  type="button"
                  aria-pressed={schemaFormat === format}
                  onClick={() => onFormatChange(format)}
                  className={`border-2 border-ink px-3 py-1.5 text-sm font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
                    schemaFormat === format
                      ? "bg-acid text-ink shadow-[2px_2px_0_var(--palette-ink)]"
                      : "text-neutral-600 hover:bg-paper hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || !hasUnsavedChanges}
              className="ml-2 border-2 border-ink bg-pink px-4 py-2 text-sm font-black text-ink shadow-[3px_3px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-ink)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </Panel>
        </ReactFlow>
      </SchemaFormatContext.Provider>
    </motion.div>
  );
}
