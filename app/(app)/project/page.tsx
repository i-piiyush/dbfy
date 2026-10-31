// app/project/[id]/page.tsx
"use client";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import { useEffect, useState } from "react";
import { Check, Clipboard, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
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

  useEffect(() => {
    if (projectError) toast.error(projectError);
  }, [projectError]);

  async function copySchema() {
    await navigator.clipboard.writeText(schema);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="h-screen w-full flex">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#18181b",
            color: "#fafafa",
            borderRadius: "10px",
            fontSize: "13px",
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#18181b" },
          },
        }}
      />
      <aside className="z-10 flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-5">
        <Link href="/project" className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">D</span>
          <span>
            <span className="block text-sm font-semibold tracking-tight text-zinc-900">DBFY</span>
            <span className="block text-xs text-zinc-500">Project workspace</span>
          </span>
        </Link>

        <div className="mt-8">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Workspace</p>
          <button
            onClick={createTable}
            type="button"
            className="mt-3 flex w-full items-center gap-3 rounded-xl bg-zinc-900 px-3 py-3 text-left text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-lg leading-none">+</span>
            Add table
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-medium text-zinc-800">Schema designer</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Build tables and export SQL or Prisma schemas.</p>
        </div>

        <div className="mt-auto border-t border-zinc-200 pt-4">
          <Show when="signed-in">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <UserButton />
              <span className="text-sm font-medium text-zinc-700">Profile</span>
            </div>
            <Link
              href="/sign-out"
              className="mt-2 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Log out
            </Link>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Create an account
            </Link>
          </Show>
        </div>
      </aside>

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
            <div
              role="group"
              aria-label="Database schema format"
              className="inline-flex rounded-xl bg-zinc-200/80 p-1 shadow-inner"
            >
              {([
                ["sql", "SQL Schema"],
                ["prisma", "Prisma Schema"],
              ] as const).map(([format, label]) => (
                <button
                  key={format}
                  type="button"
                  aria-pressed={schemaFormat === format}
                  onClick={() => {
                    setSchemaFormat(format);
                    setCopied(false);
                    setSchemaOpen(true);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                    schemaFormat === format
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
