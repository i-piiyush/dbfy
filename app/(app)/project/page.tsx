// app/project/[id]/page.tsx
"use client";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TableNode from "@/components/TableNode";
import { useProjectStore } from "@/store/projectStore";

const nodeTypes = { tableNode: TableNode };

export default function ProjectPage() {
  const nodes = useProjectStore((s) => s.nodes);
  const edges = useProjectStore((s) => s.edges);
  const onNodesChange = useProjectStore((s) => s.onNodesChange);
  const onEdgesChange = useProjectStore((s) => s.onEdgesChange);
  const createTable = useProjectStore((s) => s.createTable);

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
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <button className="rounded bg-blue-600 px-4 py-2 text-white text-sm">
              Save
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}