import Link from "next/link";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";

export default function ProjectLoadState({ loading, projectName, error }: {
  loading: boolean;
  projectName: string;
  error: string;
}) {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <WorkspaceSidebar projectName={projectName} />
      <section className="ml-18 flex min-h-screen items-center justify-center p-6 md:ml-64">
        <div className="w-full max-w-lg border-[3px] border-ink bg-paper p-6 shadow-[7px_7px_0_var(--palette-ink)] sm:p-8">
          {loading ? (
            <>
              <div className="size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-brand" />
              <h1 className="mt-5 text-xl font-black">Loading your project...</h1>
              <p className="mt-1 text-sm font-medium text-neutral-600">Getting your tables and fields ready.</p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-black">Couldn’t load this project.</h1>
              <p className="mt-2 text-sm font-medium text-neutral-600">{error}</p>
              <Link href="/playground" className="mt-5 inline-flex items-center border-2 border-ink bg-acid px-4 py-2 text-sm font-black shadow-[3px_3px_0_var(--palette-ink)]">Back to projects</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
