"use client";

import { useMemo, useReducer } from "react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import PlaygroundHeader from "@/components/playground/PlaygroundHeader";
import PlaygroundHero from "@/components/playground/PlaygroundHero";
import ProjectToolbar from "@/components/playground/ProjectToolbar";
import ProjectGrid from "@/components/playground/ProjectGrid";
import ProjectDialogs from "@/components/playground/ProjectDialogs";
import {
  ProjectEmptyState,
  ProjectErrorState,
  ProjectLoadingState,
} from "@/components/playground/ProjectListStates";
import { initialPlaygroundState, playgroundReducer } from "@/lib/playground-reducer";
import { useProjects } from "@/hooks/useProjects";
import { useProjectActions } from "@/hooks/useProjectActions";

export default function PlaygroundPage() {
  const [state, dispatch] = useReducer(playgroundReducer, initialPlaygroundState);
  const {
    projects,
    search,
    loading,
    error,
    createOpen,
    newProjectName,
    creating,
    createError,
    projectToRename,
    renameDraft,
    renaming,
    renameError,
    projectToDelete,
    deleting,
    deleteError,
  } = state;
  const { loadProjects } = useProjects(dispatch);
  const { createProject, renameProject, deleteProject } = useProjectActions(state, dispatch);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => project.projectName.toLowerCase().includes(query));
  }, [projects, search]);
  const totalTables = projects.reduce((count, project) => count + project.tableCount, 0);

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="min-h-screen max-w-[1600px] pl-[72px] md:pl-64">
        <WorkspaceSidebar onNewProject={() => dispatch({ type: "create-opened" })} />
        <section className="min-w-0 flex-1">
          <PlaygroundHeader onNewProject={() => dispatch({ type: "create-opened" })} />

          <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-9 sm:px-8 sm:pt-12 lg:px-12">
            <PlaygroundHero projectCount={projects.length} tableCount={totalTables} loading={loading} />
            <ProjectToolbar
              countLabel={loading ? "…" : String(filteredProjects.length)}
              search={search}
              onSearchChange={(value) => dispatch({ type: "search-changed", value })}
            />

            {error ? (
              <ProjectErrorState
                message={error}
                onRetry={() => {
                  dispatch({ type: "projects-retry" });
                  void loadProjects();
                }}
              />
            ) : loading ? (
              <ProjectLoadingState />
            ) : filteredProjects.length === 0 ? (
              <ProjectEmptyState
                search={search}
                onCreate={() => dispatch({ type: "create-opened" })}
              />
            ) : (
              <ProjectGrid
                projects={filteredProjects}
                onRename={(project) => dispatch({ type: "rename-opened", project })}
                onDelete={(project) => dispatch({ type: "delete-opened", project })}
              />
            )}

            {!loading && !error && projects.length > 0 && (
              <p className="mt-8 text-center text-[11px] font-bold text-neutral-500">That’s the whole lineup — you’re all caught up ✨</p>
            )}
          </div>
        </section>
      </div>

      <ProjectDialogs
        createOpen={createOpen}
        newProjectName={newProjectName}
        creating={creating}
        createError={createError}
        onCreateNameChange={(value) => dispatch({ type: "create-name-changed", value })}
        onCreateClose={() => dispatch({ type: "create-closed" })}
        onCreateSubmit={createProject}
        projectToRename={projectToRename}
        renameDraft={renameDraft}
        renaming={renaming}
        renameError={renameError}
        onRenameDraftChange={(value) => dispatch({ type: "rename-draft-changed", value })}
        onRenameClose={() => dispatch({ type: "rename-closed" })}
        onRenameSubmit={renameProject}
        projectToDelete={projectToDelete}
        deleting={deleting}
        deleteError={deleteError}
        onDeleteClose={() => dispatch({ type: "delete-closed" })}
        onDeleteConfirm={deleteProject}
      />
    </main>
  );
}
