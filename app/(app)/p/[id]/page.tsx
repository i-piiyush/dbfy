// app/project/[id]/page.tsx
"use client";
import Link from "next/link";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { Check, Clipboard, X } from "lucide-react";
import "@xyflow/react/dist/style.css";
import TableNode from "@/components/TableNode";
import { useProjectStore } from "@/store/projectStore";
import { generatePrismaSchema, generateSqlSchema } from "@/lib/schemaGenerator";
import { SchemaFormatContext } from "@/components/SchemaFormatContext";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { motion } from "motion/react";
import type { SchemaFormat } from "@/lib/data";
import type { response } from "@/types/response.type";
import type { ITableData } from "@/types/fieldModel.type";
import type { Edge, Node } from "@xyflow/react";
import { useConfirmDialog, useToast } from "@/components/ui/FeedbackProvider";
import SchemaCodeViewer from "@/components/SchemaCodeViewer";

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
  const [savedTablesSnapshot, setSavedTablesSnapshot] = useState<string | null>(null);
  const [schemaFormat, setSchemaFormat] = useState<SchemaFormat>("sql");
  const toast = useToast();
  const confirm = useConfirmDialog();
  const nodes = useProjectStore((s) => s.nodes);
  const edges = useProjectStore((s) => s.edges);
  const onNodesChange = useProjectStore((s) => s.onNodesChange);
  const onEdgesChange = useProjectStore((s) => s.onEdgesChange);
  const onConnect = useProjectStore((s) => s.onConnect);
  const projectError = useProjectStore((s) => s.projectError);
  const projectErrorId = useProjectStore((s) => s.projectErrorId);
  const createTable = useProjectStore((s) => s.createTable);
  const tables = useProjectStore((s) => s.tables);
  const hasUnsavedChanges = savedTablesSnapshot !== null
    && JSON.stringify(tables) !== savedTablesSnapshot;
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
        setSavedTablesSnapshot(JSON.stringify(loadedTables));
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
          newTableToFocus: null,
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
  }, [projectError, projectErrorId, toast]);

  async function copySchema() {
    await navigator.clipboard.writeText(schema);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function saveTables() {
    if (saving || !hasUnsavedChanges) return;
    if (tables.length === 0) {
      const confirmed = await confirm({
        title: "Save an empty canvas?",
        description: "This will remove all saved tables from this project.",
        confirmLabel: "Save empty canvas",
      });
      if (!confirmed) return;
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
      setSavedTablesSnapshot(submittedSnapshot);
    } catch {
      toast.error("Could not save the project because the server returned an invalid response or could not be reached.");
    } finally {
      setSaving(false);
    }
  }

  if (projectLoading || projectLoadError) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <WorkspaceSidebar projectName={projectName} onAddTable={!projectLoading && !projectLoadError ? createTable : undefined} />
        <section className="ml-[72px] flex min-h-screen items-center justify-center p-6 md:ml-64">
        <div className="w-full max-w-lg border-[3px] border-ink bg-paper p-6 shadow-[7px_7px_0_var(--palette-ink)] sm:p-8">
          {projectLoading ? (
            <>
              <div className="size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-brand" />
              <h1 className="mt-5 text-xl font-black">Loading your project...</h1>
              <p className="mt-1 text-sm font-medium text-neutral-600">Getting your tables and fields ready.</p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-black">Couldn’t load this project.</h1>
              <p className="mt-2 text-sm font-medium text-neutral-600">{projectLoadError}</p>
              <Link href="/playground" className="mt-5 inline-flex items-center border-2 border-ink bg-acid px-4 py-2 text-sm font-black shadow-[3px_3px_0_var(--palette-ink)]">Back to projects</Link>
            </>
          )}
        </div>
        </section>
      </main>
    );
  }

  return (
    <div className="h-screen w-full bg-canvas text-ink">
      <WorkspaceSidebar projectName={projectName} onAddTable={!projectLoading && !projectLoadError ? createTable : undefined} />

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-y-0 left-[72px] right-0 h-full md:left-64">
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
            <div
              role="group"
              aria-label="Database schema format"
              className="inline-flex border-2 border-ink bg-canvas p-1 shadow-[3px_3px_0_var(--palette-ink)]"
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
              onClick={() => void saveTables()}
              disabled={saving || !hasUnsavedChanges}
              className="ml-2 border-2 border-ink bg-pink px-4 py-2 text-sm font-black text-ink shadow-[3px_3px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-ink)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </Panel>
        </ReactFlow>
        </SchemaFormatContext.Provider>
      </motion.div>

      {schemaOpen && (
        <>
          <button
            aria-label="Close Prisma schema sidebar"
            className="fixed inset-0 z-20 cursor-default bg-black/20"
            onClick={() => setSchemaOpen(false)}
          />
          <motion.aside
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            aria-label={schemaTitle}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l-[3px] border-ink bg-paper shadow-2xl"
          >
            <header className="flex items-center justify-between border-b-[3px] border-ink bg-violet px-5 py-4">
              <div>
                <h2 className="text-base font-black text-ink">{schemaTitle}</h2>
                <p className="mt-1 text-xs font-medium text-neutral-600">Generated from your current diagram</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySchema}
                  className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-3 py-2 text-sm font-black text-paper shadow-[3px_3px_0_var(--palette-purple)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-purple)]"
                >
                  {copied ? <Check size={16} /> : <Clipboard size={16} />}
                  {copied ? "Copied" : "Copy schema"}
                </button>
                <button
                  onClick={() => setSchemaOpen(false)}
                  aria-label="Close sidebar"
                  className="border-2 border-transparent p-2 text-ink hover:border-ink hover:bg-coral"
                >
                  <X size={18} />
                </button>
              </div>
            </header>
            <SchemaCodeViewer
              language={schemaFormat}
              code={schema || (schemaFormat === "sql"
                ? "-- Add a table to generate your SQL schema."
                : "// Add a table to generate your Prisma schema.")}
            />
          </motion.aside>
        </>
      )}
    </div>
  );
}
