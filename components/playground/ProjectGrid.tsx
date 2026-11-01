import type { ProjectSummary } from "@/types/project";
import ProjectCard from "@/components/playground/ProjectCard";

export default function ProjectGrid({ projects, onRename, onDelete }: {
  projects: ProjectSummary[];
  onRename: (project: ProjectSummary) => void;
  onDelete: (project: ProjectSummary) => void;
}) {
  return (
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} index={index} onRename={onRename} onDelete={onDelete} />
      ))}
    </div>
  );
}
