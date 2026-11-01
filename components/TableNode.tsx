"use client";

import { Handle, Position } from "@xyflow/react";
import { KeyRound, Link2, Pencil, Plus, Table2, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import type { DraftField, SchemaField } from "@/types/schema";
import { useProjectStore } from "@/store/project-store";
import FieldForm from "./FieldForm";
import { SchemaFormatContext } from "./SchemaFormatContext";
import { useConfirmDialog } from "@/components/ui/FeedbackProvider";

const emptyDraft: DraftField = {
  name: "",
  type: "String",
  isPK: false,
  isNullable: true,
  isUnique: false,
  generatedId: undefined,
};

export default function TableNode({ id }: { id: string }) {
  const schemaFormat = useContext(SchemaFormatContext);
  const table = useProjectStore((state) => state.tables.find((item) => item.tableId === id));
  const updateTableName = useProjectStore((state) => state.updateTableName);
  const updateField = useProjectStore((state) => state.updateField);
  const addField = useProjectStore((state) => state.addField);
  const deleteField = useProjectStore((state) => state.deleteField);
  const deleteTable = useProjectStore((state) => state.deleteTable);
  const shouldFocusName = useProjectStore((state) => state.newTableToFocus === id);
  const consumeNewTableFocus = useProjectStore((state) => state.consumeNewTableFocus);
  const confirm = useConfirmDialog();

  const [isAdding, setIsAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<DraftField>(emptyDraft);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftField>(emptyDraft);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(table?.name ?? "");

  if (!table) return null;
  const currentTable = table;

  const canAddField = currentTable.fields.length === 0 || Boolean(
    currentTable.fields[0]?.name.trim() && currentTable.fields[0]?.type,
  );

  function saveNewField() {
    if (!addDraft.name.trim()) return;
    const added = addField(currentTable.tableId, {
      name: addDraft.name,
      type: addDraft.type,
      isNullable: addDraft.isNullable,
      isPK: addDraft.isPK,
      isUnique: addDraft.isUnique,
      generatedId: addDraft.generatedId,
    });
    if (!added) return;
    setAddDraft(emptyDraft);
    setIsAdding(false);
  }

  function startEdit(field: SchemaField) {
    setEditingFieldId(field.fieldId);
    setEditDraft({
      name: field.name,
      type: field.type ?? "String",
      isPK: field.isPK,
      isNullable: field.isNullable,
      isUnique: field.isUnique,
      generatedId: field.generatedId,
    });
  }

  function saveEditedField() {
    if (!editingFieldId || !editDraft.name.trim()) return;
    const updated = updateField(currentTable.tableId, editingFieldId, {
      name: editDraft.name.trim(),
      type: editDraft.type,
      isPK: editDraft.isPK,
      isNullable: editDraft.isNullable,
      isUnique: editDraft.isUnique,
      generatedId: editDraft.generatedId,
    });
    if (updated) setEditingFieldId(null);
  }

  function commitTableName() {
    const name = nameDraft.trim();
    if (!name) {
      setNameDraft(currentTable.name);
      setIsEditingName(false);
      return;
    }
    updateTableName(currentTable.tableId, name);
    setIsEditingName(false);
  }

  return (
    <div
      className="min-w-[300px] border-[3px] border-ink bg-paper text-ink shadow-[6px_6px_0_var(--palette-ink)]"
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("button, input, select, label")) event.stopPropagation();
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button, input, select, label")) event.stopPropagation();
      }}
    >
      <header className="border-b-[3px] border-ink bg-acid px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em]">
            <Table2 size={13} strokeWidth={2.7} /> Schema table
          </span>
          <span className="border-2 border-ink bg-paper px-1.5 py-0.5 font-mono text-[9px] font-black">
            {currentTable.fields.length.toString().padStart(2, "0")} FIELDS
          </span>
          <button
            type="button"
            aria-label={`Delete table ${currentTable.name || "Untitled table"}`}
            title="Delete table"
            onClick={async () => {
              const confirmed = await confirm({
                title: `Delete ${currentTable.name || "Untitled table"}?`,
                description: "This removes the table and all its fields from the canvas. You can save the project to persist this change.",
                confirmLabel: "Delete table",
              });
              if (confirmed) deleteTable(currentTable.tableId);
            }}
            className="grid size-7 place-items-center border-2 border-ink bg-paper hover:bg-pink"
          >
            <Trash2 size={13} strokeWidth={2.7} />
          </button>
        </div>
        {isEditingName || shouldFocusName ? (
          <input
            autoFocus
            value={nameDraft}
            onFocus={(event) => {
              event.currentTarget.select();
              setIsEditingName(true);
              consumeNewTableFocus(id);
            }}
            onChange={(event) => setNameDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitTableName();
              if (event.key === "Escape") {
                setNameDraft(currentTable.name);
                setIsEditingName(false);
              }
            }}
            onBlur={commitTableName}
            placeholder="table_name"
            className="w-full border-2 border-ink bg-paper px-2 py-1.5 text-sm font-black outline-none focus:ring-2 focus:ring-brand"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setNameDraft(currentTable.name);
              setIsEditingName(true);
            }}
            title="Rename table"
            className="w-full truncate text-left text-lg font-black tracking-[-0.04em] hover:text-brand"
          >
            {currentTable.name || "Untitled table"}
          </button>
        )}
      </header>

      <div className="divide-y-2 divide-dashed divide-neutral-200">
        {currentTable.fields.length === 0 && (
          <div className="px-4 py-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider">No fields yet</p>
            <p className="mt-1 text-[11px] font-medium text-neutral-600">Start with a field name and type.</p>
          </div>
        )}

        <>
          {currentTable.fields.map((field: SchemaField) => {
            const isEditing = editingFieldId === field.fieldId;
            if (isEditing) {
              return (
                <FieldForm
                    key={`edit-${field.fieldId}`}
                    draft={editDraft}
                    setDraft={setEditDraft}
                    schemaFormat={schemaFormat}
                    canSetPrimaryKey={!currentTable.fields.some((item) => item.isPK && item.fieldId !== field.fieldId)}
                    onSave={saveEditedField}
                    onCancel={() => setEditingFieldId(null)}
                  />
              );
            }

            return (
              <div
                key={field.fieldId}
                className="group relative flex min-h-12 items-center gap-2 px-4 py-2.5 hover:bg-lemon"
              >
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`target:${field.fieldId}`}
                  className="!h-2.5 !w-2.5 !border-2 !border-ink !bg-paper group-hover:!bg-brand"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-extrabold">{field.name || "Unnamed field"}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {field.isPK && <span className="inline-flex items-center gap-1 border border-ink bg-violet px-1 py-0.5 font-mono text-[8px] font-black"><KeyRound size={9} />PK</span>}
                    {field.isUnique && <span className="border border-ink bg-sky px-1 py-0.5 font-mono text-[8px] font-black">UNIQUE</span>}
                    {!field.isNullable && <span className="border border-ink bg-coral px-1 py-0.5 font-mono text-[8px] font-black">NOT NULL</span>}
                    {field.references && <span title="References another field" className="inline-flex items-center gap-1 border border-ink bg-lemon px-1 py-0.5 font-mono text-[8px] font-black"><Link2 size={9} />FK</span>}
                  </div>
                </div>

                <span className={`max-w-[88px] truncate border border-ink px-2 py-1 font-mono text-[10px] font-bold ${field.type ? "bg-violet" : "bg-coral"}`}>
                  {field.type ?? "No type"}
                </span>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(field)}
                    aria-label={`Edit ${field.name || "field"}`}
                    title="Edit field"
                    className="grid size-7 place-items-center border-2 border-ink bg-paper hover:bg-violet"
                  >
                    <Pencil size={12} strokeWidth={2.7} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteField(currentTable.tableId, field.fieldId)}
                    aria-label={`Delete ${field.name || "field"}`}
                    title="Delete field"
                    className="grid size-7 place-items-center border-2 border-ink bg-paper hover:bg-pink"
                  >
                    <Trash2 size={12} strokeWidth={2.7} />
                  </button>
                </div>

                <Handle
                  type="source"
                  position={Position.Right}
                  id={`source:${field.fieldId}`}
                  className="!h-2.5 !w-2.5 !border-2 !border-ink !bg-paper group-hover:!bg-brand"
                />
              </div>
            );
          })}
        </>
      </div>

      {isAdding ? (
            <FieldForm
              draft={addDraft}
              setDraft={setAddDraft}
              schemaFormat={schemaFormat}
              canSetPrimaryKey={!currentTable.fields.some((field) => field.isPK)}
              onSave={saveNewField}
              onCancel={() => {
                setIsAdding(false);
                setAddDraft(emptyDraft);
              }}
            />
        ) : (
          <footer className="border-t-[3px] border-ink p-2.5">
            <button
              type="button"
              disabled={!canAddField}
              onClick={() => setIsAdding(true)}
              className="flex w-full items-center justify-center gap-2 border-2 border-ink bg-acid px-3 py-2 text-[11px] font-black uppercase tracking-wide shadow-[3px_3px_0_var(--palette-ink)] hover:shadow-[1px_1px_0_var(--palette-ink)] disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none"
            >
              <Plus size={14} strokeWidth={3} /> Add field
            </button>
          </footer>
        )}
    </div>
  );
}
