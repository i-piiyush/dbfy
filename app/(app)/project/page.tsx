// app/project/[id]/page.tsx
"use client";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TableNode from "@/components/TableNode";
import { useProjectStore } from "@/store/projectStore";
import { logPrismaSchema } from "@/lib/schemaGenerator";

const nodeTypes = { tableNode: TableNode };

export default function ProjectPage() {
  const nodes = useProjectStore((s) => s.nodes);
  const edges = useProjectStore((s) => s.edges);
  const onNodesChange = useProjectStore((s) => s.onNodesChange);
  const onEdgesChange = useProjectStore((s) => s.onEdgesChange);
  const onConnect = useProjectStore((s) => s.onConnect);
  const projectError = useProjectStore((s) => s.projectError);
  const createTable = useProjectStore((s) => s.createTable);

  console.log("project page: ",useProjectStore((s)=>s.tables))

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
            <button
              onClick={logPrismaSchema}
              className="rounded bg-blue-600 px-4 py-2 text-white text-sm"
            >
              Log Prisma Schema
            </button>
            <button className="ml-2 rounded bg-zinc-600 px-4 py-2 text-white text-sm">
              Save
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
