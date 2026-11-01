"use client";

import { use, useEffect, useMemo, useReducer } from "react";
import "@xyflow/react/dist/style.css";
import ProjectCanvas from "@/components/project-editor/ProjectCanvas";
import ProjectLoadState from "@/components/project-editor/ProjectLoadState";
import SchemaSidebar from "@/components/project-editor/SchemaSidebar";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useConfirmDialog, useToast } from "@/components/ui/FeedbackProvider";
import { useProjectLoader } from "@/hooks/useProjectLoader";
import { useProjectSaver } from "@/hooks/useProjectSaver";
import { generatePrismaSchema, generateSqlSchema } from "@/lib/schema-generator";
import { initialProjectEditorState, projectEditorReducer } from "@/lib/project-editor-reducer";
import { useProjectStore } from "@/store/project-store";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [editor, dispatch] = useReducer(projectEditorReducer, initialProjectEditorState);
  const {
    schemaOpen,
    copied,
    saving,
    projectName,
    projectLoading,
    projectLoadError,
    savedTablesSnapshot,
    schemaFormat,
  } = editor;
  const toast = useToast();
  const confirm = useConfirmDialog();

  // Zustand owns the canvas graph; the reducer owns editor UI state.
  const nodes = useProjectStore((state) => state.nodes);
  const edges = useProjectStore((state) => state.edges);
  const tables = useProjectStore((state) => state.tables);
  const onNodesChange = useProjectStore((state) => state.onNodesChange);
  const onEdgesChange = useProjectStore((state) => state.onEdgesChange);
  const onConnect = useProjectStore((state) => state.onConnect);
  const projectError = useProjectStore((state) => state.projectError);
  const projectErrorId = useProjectStore((state) => state.projectErrorId);
  const createTable = useProjectStore((state) => state.createTable);

  useProjectLoader(id, dispatch);

  const currentTablesSnapshot = useMemo(() => JSON.stringify(tables), [tables]);
  const hasUnsavedChanges = savedTablesSnapshot !== null && currentTablesSnapshot !== savedTablesSnapshot;
  const schema = useMemo(
    () => schemaFormat === "sql" ? generateSqlSchema(tables) : generatePrismaSchema(tables),
    [schemaFormat, tables],
  );
  const saveTables = useProjectSaver({
    projectId: id,
    tables,
    saving,
    hasUnsavedChanges,
    confirm,
    toast,
    dispatch,
  });

  useEffect(() => {
    if (projectError) toast.error(projectError);
  }, [projectError, projectErrorId, toast]);

  async function copySchema() {
    await navigator.clipboard.writeText(schema);
    dispatch({ type: "copied", value: true });
    window.setTimeout(() => dispatch({ type: "copied", value: false }), 1800);
  }

  if (projectLoading || projectLoadError) {
    return <ProjectLoadState loading={projectLoading} projectName={projectName} error={projectLoadError} />;
  }

  return (
    <div className="h-screen w-full bg-canvas text-ink">
      <ProjectCanvas
        nodes={nodes}
        edges={edges}
        schemaFormat={schemaFormat}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onFormatChange={(format) => dispatch({ type: "schema-format", format })}
        onSave={() => void saveTables()}
      />
      <WorkspaceSidebar projectName={projectName} onAddTable={createTable} />
      {schemaOpen && (
        <SchemaSidebar
          format={schemaFormat}
          copied={copied}
          code={schema}
          onCopy={() => void copySchema()}
          onClose={() => dispatch({ type: "schema-panel", open: false })}
        />
      )}
    </div>
  );
}
