// components/TableNode.tsx
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Column, DraftField } from "@/types/tableNode.type";
import { useProjectStore } from "@/store/projectStore";
import FieldForm from "./FieldForm";
import { TYPE_COLORS } from "@/lib/data";

const emptyDraft: DraftField = {
  name: "",
  type: "String",
  isPK: false,
  isNullable: true,
  isUnique: false,
};

export default function TableNode({ id }: { id: string }) {
  const table = useProjectStore((s) => s.tables.find((t) => t.tableId === id));

  const updateTableName = useProjectStore((s) => s.updateTableName);
  const deleteTable = useProjectStore((s) => s.deleteTable);
  const updateField = useProjectStore((s) => s.updateField);
  const addField = useProjectStore((s) => s.addField);
  const deleteField = useProjectStore((s) => s.deleteField);

  const [isAdding, setIsAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<DraftField>(emptyDraft);

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftField>(emptyDraft);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(table?.name ?? "");

  if (!table) return null;

  // --- ACTIONS WIREDFUP WITH CONSOLE LOGS ---
  const handleAddSave = () => {
    if (!addDraft.name.trim()) return;

    console.log("➕ ADD FIELD TRIGGERED:", {
      tableId: table.tableId,
      newFieldData: addDraft,
    });

    console.log("handle edit chla editing field id, ", addDraft);
    const fields: DraftField = {
      name: addDraft.name,
      type: addDraft.type,
      isNullable: addDraft.isNullable,
      isPK: addDraft.isPK,
      isUnique: addDraft.isUnique,
    };

    console.log("fields: ", fields);

    addField(table.tableId, fields);

    setAddDraft(emptyDraft);
    setIsAdding(false);
  };

  const startEdit = (col: Column) => {
    setEditingFieldId(col.fieldId);
    setEditDraft({
      name: col.name,
      type: col.type ?? "String",
      isPK: !!col.isPK,
      isNullable: col.isNullable ?? true,
      isUnique: !!col.isUnique,
    });
  };

  const handleEditSave = () => {
    console.log("chla pr col ni pta");
    if (!editingFieldId || !editDraft.name.trim()) return;

    console.log("edit save chla editing field id, ", editingFieldId);

    const updatedField = {
      name: editDraft.name.trim(),
      type: editDraft.type,
      isPK: editDraft.isPK,
      isNullable: editDraft.isNullable,
      isUnique: editDraft.isUnique,
    };

    updateField(table.tableId, editingFieldId, updatedField);

    console.log("📝 UPDATE FIELD TRIGGERED:", {
      tableId: table.tableId,
      fieldId: editingFieldId,
      updatedData: updatedField,
    });

    setEditingFieldId(null);
  };

  const handleDeleteField = (fieldId: string) => {
    console.log("🗑️ DELETE FIELD TRIGGERED:", {
      tableId: table.tableId,
      fieldId: fieldId,
    });

    deleteField(table.tableId, fieldId);
  };

  const handleDeleteTable = () => {
    deleteTable(table.tableId);
    console.log("💥 DELETE TABLE TRIGGERED:", {
      tableId: table.tableId,
    });
  };

  const commitNameChange = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;

    updateTableName(table.tableId, trimmed);
    console.log("🏷️ RENAME TABLE TRIGGERED:", {
      tableId: table.tableId,
      oldName: table.name,
      newName: trimmed,
    });

    setIsEditingName(false);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-900/50 min-w-[260px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-900/10 flex items-center justify-between gap-2 group/header">
        {isEditingName ? (
          <input
            autoFocus
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && nameDraft.trim()) commitNameChange();
              if (e.key === "Escape") {
                setNameDraft(table.name);
                setIsEditingName(false);
              }
            }}
            onBlur={() => {
              if (nameDraft.trim()) commitNameChange();
            }}
            placeholder="table_name"
            className="flex-1 text-sm font-semibold bg-white border border-indigo-300 rounded-md px-2 py-1 outline-none text-zinc-800 placeholder-zinc-300 min-w-0"
          />
        ) : (
          <button
            onClick={() => {
              setNameDraft(table.name);
              setIsEditingName(true);
            }}
            className="flex-1 text-left text-sm font-semibold text-zinc-800 tracking-tight truncate hover:text-indigo-600 transition-colors"
            title="Click to rename"
          >
            {table.name}
          </button>
        )}

        <button
          onClick={handleDeleteTable}
          className="opacity-0 group-hover/header:opacity-100 p-1 rounded hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-opacity shrink-0"
          title="Delete table"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Column rows */}
      <div className="divide-y divide-zinc-100">
        {table.fields.map((col: Column, i: number) => {
          const isEditing = editingFieldId === col.fieldId;

          if (isEditing) {
            return (
              <FieldForm
                key={col.fieldId}
                draft={editDraft}
                setDraft={setEditDraft}
                canSetPrimaryKey={!table.fields.some((field) => field.isPK && field.fieldId !== col.fieldId)}
                onSave={handleEditSave}
                onCancel={() => setEditingFieldId(null)}
              />
            );
          }

          const colors = col.type ? TYPE_COLORS[col.type] : undefined;

          return (
            <div
              key={col.fieldId}
              className="relative flex items-center justify-between px-4 py-2 group"
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`target:${col.fieldId}`}
                className="!w-2 !h-2 !bg-zinc-200 group-hover:!bg-indigo-400 !border-0 !transition-colors"
              />

              <span className="text-xs text-zinc-600 truncate max-w-[80px]">
                {col.name || <span className="text-zinc-300">unnamed</span>}
              </span>

              <div className="flex items-center gap-1.5">
                {col.isPK && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-400 border border-zinc-200">
                    PK
                  </span>
                )}
                {!col.isNullable && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-50 text-red-400 border border-red-100">
                    NN
                  </span>
                )}
                {col.isUnique && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-400 border border-purple-100">
                    U
                  </span>
                )}

                {col.type && colors ? (
                  <span
                    className={`${colors.bg} ${colors.text} px-2 py-1 rounded text-[11px] font-mono`}
                  >
                    {col.type}
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-[11px] font-mono bg-red-50 text-red-500">
                    ?
                  </span>
                )}

                <button
                  onClick={() => startEdit(col)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-indigo-500 transition-opacity"
                  title="Edit field"
                >
                  <Pencil size={12} />
                </button>

                <button
                  onClick={() => handleDeleteField(col.fieldId)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-opacity"
                  title="Delete field"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <Handle
                type="source"
                position={Position.Right}
                id={`source:${col.fieldId}`}
                className="!w-2 !h-2 !bg-zinc-200 group-hover:!bg-indigo-400 !border-0 !transition-colors"
              />
            </div>
          );
        })}
      </div>

      {/* Add field inline form */}
      {isAdding && (
        <FieldForm
          draft={addDraft}
          setDraft={setAddDraft}
          canSetPrimaryKey={!table.fields.some((field) => field.isPK)}
          onSave={handleAddSave}
          onCancel={() => {
            setIsAdding(false);
            setAddDraft(emptyDraft);
          }}
        />
      )}

      {/* Footer */}
      {!isAdding && (
        <div className="px-3 py-2 border-t border-zinc-100">
          <button
            onClick={() => {
              setIsAdding(true);
              // handleAddSave()
            }}
            className="w-full flex items-center justify-center gap-1 text-[11px] text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg py-1.5 transition-all duration-150 font-medium"
          >
            <Plus size={12} />
            Add field
          </button>
        </div>
      )}
    </div>
  );
}
