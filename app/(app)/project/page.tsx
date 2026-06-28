// app/project/[id]/page.tsx
"use client";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TableNode from "@/components/TableNode";
import { useState } from "react";

const nodeTypes = { tableNode: TableNode };


export default function ProjectPage() {
  const [addField,setAddField] = useState(false)
  const nodes = [
  {
    id: "1",
    type: "tableNode",
    position: { x: 200, y: 150 },
    data: {
      label: "Users",
      schema: [
        { title: "id", type: "UUID", isPK: true },
        { title: "email", type: "String" },
        { title: "createdAt", type: "DateTime" },
      ],
      setAddField,addField
    },
  },
];

  return (
    <div className="h-screen w-full">
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}