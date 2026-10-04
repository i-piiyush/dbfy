// app/project/[id]/page.tsx
"use client";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import { useState } from "react";
import { Check, Clipboard, X } from "lucide-react";
import "@xyflow/react/dist/style.css";
import TableNode from "@/components/TableNode";
import { useProjectStore } from "@/store/projectStore";
import { generatePrismaSchema, generateSqlSchema } from "@/lib/schemaGenerator";
import { SchemaFormatContext } from "@/components/SchemaFormatContext";
import type { SchemaFormat } from "@/lib/data";

const nodeTypes = { tableNode: TableNode };

export default function ProjectPage() {
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [schemaFormat, setSchemaFormat] = useState<SchemaFormat>("sql");
  const nodes = useProjectStore((s) => s.nodes);
  const edges = useProjectStore((s) => s.edges);
  const onNodesChange = useProjectStore((s) => s.onNodesChange);
  const onEdgesChange = useProjectStore((s) => s.onEdgesChange);
  const onConnect = useProjectStore((s) => s.onConnect);
  const projectError = useProjectStore((s) => s.projectError);
  const createTable = useProjectStore((s) => s.createTable);
  const tables = useProjectStore((s) => s.tables);
  const schema = schemaFormat === "sql"
    ? generateSqlSchema(tables)
    : generatePrismaSchema(tables);
  const schemaTitle = schemaFormat === "sql" ? "SQL schema" : "Prisma schema";

  async function copySchema() {
    await navigator.clipboard.writeText(schema);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="h-screen w-full flex">
      {/* Left toolbar */}
      <div className="w-12 bg-white border-r flex flex-col items-center py-4 gap-4 z-10">
        <button
          onClick={createTable}
          title="Add Table"
          className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600 text-xl"
        >
          +
        </button>
      </div>

      <div className="flex-1 h-full">
        <SchemaFormatContext.Provider value={schemaFormat}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            {projectError && (
              <p role="alert" className="mb-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
                {projectError}
              </p>
            )}
            <label className="sr-only" htmlFor="schema-format">Schema format</label>
            <select
              id="schema-format"
              value={schemaFormat}
              onChange={(event) => {
                setSchemaFormat(event.target.value as SchemaFormat);
                setCopied(false);
                setSchemaOpen(true);
              }}
              className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm"
            >
              <option value="sql">SQL Schema</option>
              <option value="prisma">Prisma Schema</option>
            </select>
            <button className="ml-2 rounded bg-zinc-600 px-4 py-2 text-white text-sm">
              Save
            </button>
          </Panel>
        </ReactFlow>
        </SchemaFormatContext.Provider>
      </div>

      {schemaOpen && (
        <>
          <button
            aria-label="Close Prisma schema sidebar"
            className="fixed inset-0 z-20 cursor-default bg-black/20"
            onClick={() => setSchemaOpen(false)}
          />
          <aside
            aria-label={schemaTitle}
            className="fixed inset-y-0 right-0 z-30 flex w-full max-w-xl flex-col border-l border-zinc-200 bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">{schemaTitle}</h2>
                <p className="mt-1 text-xs text-zinc-500">Generated from your current diagram</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySchema}
                  className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                  {copied ? <Check size={16} /> : <Clipboard size={16} />}
                  {copied ? "Copied" : "Copy schema"}
                </button>
                <button
                  onClick={() => setSchemaOpen(false)}
                  aria-label="Close sidebar"
                  className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <X size={18} />
                </button>
              </div>
            </header>
            <pre className="flex-1 overflow-auto bg-zinc-50 p-5 font-mono text-sm leading-6 text-zinc-800">
              <code>{schema || "// Add a table to generate your Prisma schema."}</code>
            </pre>
          </aside>
        </>
      )}
    </div>
  );
}
