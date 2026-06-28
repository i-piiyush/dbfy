// components/TableNode.tsx
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

type Column = {
  title: string;
  type: string;
  isPK?: boolean;
};

type TableNodeData = {
  label: string;
  schema: Column[];
  setAddField: (v: boolean) => void;
  addField: boolean;
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  UUID:     { bg: "bg-zinc-100",   text: "text-zinc-500" },
  String:   { bg: "bg-blue-50",    text: "text-blue-500" },
  Int:      { bg: "bg-orange-50",  text: "text-orange-500" },
  Boolean:  { bg: "bg-green-50",   text: "text-green-600" },
  Float:    { bg: "bg-yellow-50",  text: "text-yellow-600" },
  DateTime: { bg: "bg-purple-50",  text: "text-purple-500" },
  Json:     { bg: "bg-pink-50",    text: "text-pink-500" },
};

const DATATYPES = ["String", "Int", "Boolean", "Float", "DateTime", "Json", "UUID"];

export default function TableNode({ data }: { data: TableNodeData }) {
  const [fieldName, setFieldName] = useState("");
  const [dataType, setDataType] = useState("String");

  const onSave = (data)=>{
    console.log(data)
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-900/50 min-w-[240px] overflow-hidden shadow-sm">

      {/* Header */}
      <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-900/10">
        <span className="text-sm font-semibold text-zinc-800 tracking-tight">
          {data.label}
        </span>
      </div>

      {/* Column rows */}
      <div className="divide-y divide-zinc-100">
        {data.schema.map((col, i) => {
          const colors = TYPE_COLORS[col.type];
          return (
            <div key={i} className="relative flex items-center justify-between px-4 py-2 group">
              <Handle
                type="target"
                position={Position.Left}
                id={`${i}-target`}
                className="!w-2 !h-2 !bg-zinc-200 group-hover:!bg-indigo-400 !border-0 !transition-colors"
              />
              <span className="text-xs text-zinc-600">{col.title || <span className="text-zinc-300">unnamed</span>}</span>
              <div className="flex items-center gap-1.5">
                {col.isPK && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-400 border border-zinc-200">
                    PK
                  </span>
                )}
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${colors?.bg ?? "bg-zinc-100"} ${colors?.text ?? "text-zinc-400"}`}>
                  {col.type || "—"}
                </span>
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={`${i}-source`}
                className="!w-2 !h-2 !bg-zinc-200 group-hover:!bg-indigo-400 !border-0 !transition-colors"
              />
            </div>
          );
        })}
      </div>

      {/* Add field inline form */}
     {data.addField && (
  <div className="flex items-center gap-2 px-4 py-2.5 border-t border-zinc-100 bg-indigo-50/50">
    <input
      autoFocus
      type="text"
      value={fieldName}
      onChange={(e) => setFieldName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && fieldName.trim()) {
          onSave({ title: fieldName.trim(), type: dataType });
          setFieldName("");
          setDataType("String");
        }
        if (e.key === "Escape") {
          data.setAddField(false);
          setFieldName("");
        }
      }}
      placeholder="field_name"
      className="flex-1 text-xs bg-white border border-zinc-200 rounded-md px-2 py-1.5 outline-none focus:border-indigo-400 text-zinc-700 placeholder-zinc-300 min-w-0"
    />
    <select
      value={dataType}
      onChange={(e) => setDataType(e.target.value)}
      className="text-xs bg-white border border-zinc-200 rounded-md px-1.5 py-1.5 outline-none focus:border-indigo-400 text-indigo-600 cursor-pointer"
    >
      {DATATYPES.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  </div>
)}
      {/* Footer */}
      <div className="px-3 py-2 border-t border-zinc-100">
        <button
          onClick={() => data.setAddField(true)}
          className="w-full text-[11px] text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg py-1.5 transition-all duration-150 font-medium"
        >
          + Add field
        </button>
      </div>
    </div>
  );
}