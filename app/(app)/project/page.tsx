"use client";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodes = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: { label: "Node 1" },
  },
];

export default function ProjectPage() {
  return (
    <div className="h-screen w-full">
      <ReactFlow nodes={nodes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}