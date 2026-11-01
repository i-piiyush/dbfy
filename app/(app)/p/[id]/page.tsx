// app/project/[id]/page.tsx
"use client";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import { use, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Check, Clipboard, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "@xyflow/react/dist/style.css";
import TableNode from "@/components/TableNode";
import { useProjectStore } from "@/store/projectStore";
import { generatePrismaSchema, generateSqlSchema } from "@/lib/schemaGenerator";
import { SchemaFormatContext } from "@/components/SchemaFormatContext";
import type { SchemaFormat } from "@/lib/data";
import type { response } from "@/types/response.type";
import type { ITableData } from "@/types/fieldModel.type";
import type { Edge, Node } from "@xyflow/react";

const nodeTypes = { tableNode: TableNode };

type SavedProject = {
  _id: string;
  projectName: string;
  tableData: ITableData[];
  updatedAt: string;
};

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectLoadError, setProjectLoadError] = useState("");
  const savedTablesSnapshot = useRef<string | null>(null);
  const [schemaFormat, setSchemaFormat] = useState<SchemaFormat>("sql");
  const nodes = useProjectStore((s) => s.nodes);
  const edges = useProjectStore((s) => s.edges);
  const onNodesChange = useProjectStore((s) => s.onNodesChange);
  const onEdgesChange = useProjectStore((s) => s.onEdgesChange);
  const onConnect = useProjectStore((s) => s.onConnect);
  const projectError = useProjectStore((s) => s.projectError);
  const createTable = useProjectStore((s) => s.createTable);
  const tables = useProjectStore((s) => s.tables);
  const hasUnsavedChanges = savedTablesSnapshot.current !== null
    && JSON.stringify(tables) !== savedTablesSnapshot.current;
  const schema = schemaFormat === "sql"
    ? generateSqlSchema(tables)
    : generatePrismaSchema(tables);
  const schemaTitle = schemaFormat === "sql" ? "SQL schema" : "Prisma schema";

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setProjectLoading(true);
      setProjectLoadError("");
      try {
        const result = await axios.get<response<SavedProject>>(`/api/fetch-table/${encodeURIComponent(id)}`, {
          validateStatus: () => true,
        });
        if (!active) return;
        if (result.status < 200 || result.status >= 300 || !result.data.success || !result.data.data) {
          setProjectLoadError(result.data.success ? "The saved project data was missing." : result.data.message);
          return;
        }

        const savedProject = result.data.data;
        const loadedTables = savedProject.tableData;
        savedTablesSnapshot.current = JSON.stringify(loadedTables);
        const loadedNodes: Node[] = loadedTables.map((table, index) => ({
          id: table.tableId,
          type: "tableNode",
          position: { x: (index % 3) * 360 + 80, y: Math.floor(index / 3) * 320 + 80 },
          data: {},
        }));
        const loadedEdges: Edge[] = loadedTables.flatMap((table) =>
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

        useProjectStore.setState({
          tables: loadedTables,
          nodes: loadedNodes,
          edges: loadedEdges,
          projectError: null,
        });
        setProjectName(savedProject.projectName);
      } catch {
        if (active) setProjectLoadError("Couldn’t connect to this project. Check your connection and try again.");
      } finally {
        if (active) setProjectLoading(false);
      }
    }

    void loadProject();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (projectError) toast.error(projectError);
  }, [projectError]);

  async function copySchema() {
    await navigator.clipboard.writeText(schema);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function saveTables() {
    if (saving || !hasUnsavedChanges) return;
    if (tables.length === 0 && !window.confirm("This canvas is empty. Do you want to save an empty canvas to this project?")) {
      return;
    }

    const submittedTables = structuredClone(tables);
    const submittedSnapshot = JSON.stringify(submittedTables);
    setSaving(true);
    try {
      const result = await axios.post<response<{ projectName: string; tableCount: number }>>(
        "/api/save-project",
        { projectId: id, tableData: submittedTables },
        { validateStatus: () => true },
      );
      const payload = result.data;

      if (result.status < 200 || result.status >= 300 || !payload.success) {
        const details = payload.success ? [] : payload.errors ?? [];
        const visibleDetails = details.slice(0, 5);
        const remainingCount = details.length - visibleDetails.length;
        const errorMessage = [
          payload.message,
          ...visibleDetails,
          ...(remainingCount > 0 ? [`And ${remainingCount} more validation issue(s).`] : []),
        ].join(" • ");
        toast.error(errorMessage, { duration: 8000 });
        return;
      }

      toast.success(payload.message);
      savedTablesSnapshot.current = submittedSnapshot;
    } catch {
      toast.error("Could not save the project because the server returned an invalid response or could not be reached.");
    } finally {
      setSaving(false);
    }
  }

  if (projectLoading || projectLoadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] p-6 text-[#171717]">
        <section className="w-full max-w-lg border-[3px] border-black bg-white p-6 shadow-[7px_7px_0_#171717] sm:p-8">
          {projectLoading ? (
            <>
              <div className="size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#7156ff]" />
              <h1 className="mt-5 text-xl font-black">Loading your project...</h1>
              <p className="mt-1 text-sm font-medium text-neutral-600">Getting your tables and fields ready.</p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-black">Couldn’t load this project.</h1>
              <p className="mt-2 text-sm font-medium text-neutral-600">{projectLoadError}</p>
              <Link href="/playground" className="mt-5 inline-flex items-center border-2 border-black bg-[#c9ff55] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#171717]">Back to projects</Link>
            </>
          )}
        </section>
      </main>
    );
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
        <Link href="/playground" className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">D</span>
          <span>
          <span className="block text-sm font-semibold tracking-tight text-zinc-900">DBFY</span>
            <span className="block text-xs text-zinc-500">{projectName || "Project workspace"}</span>
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
            <button
              type="button"
              onClick={() => void saveTables()}
              disabled={saving || !hasUnsavedChanges}
              className="ml-2 rounded bg-zinc-600 px-4 py-2 text-white text-sm disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? "Saving…" : "Save"}
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
