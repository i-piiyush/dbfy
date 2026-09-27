"use client"

import { DATATYPES } from "@/lib/data";
import { DraftField } from "@/types/tableNode.type";
import { Check, X } from "lucide-react";

export default function FieldForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  canSetPrimaryKey = true,
}: {
  draft: DraftField;
  setDraft: (d: DraftField) => void;
  onSave: () => void;
  onCancel: () => void;
  canSetPrimaryKey?: boolean;
}) {
  return (
    <div className="px-4 py-2.5 border-t border-zinc-100 bg-indigo-50/50 space-y-2">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.name.trim()) onSave();
            if (e.key === "Escape") onCancel();
          }}
          placeholder="field_name"
          className="flex-1 text-xs bg-white border border-zinc-200 rounded-md px-2 py-1.5 outline-none focus:border-indigo-400 text-zinc-700 placeholder-zinc-300 min-w-0"
        />
        <select
          value={draft.type}
          onChange={(e) => setDraft({ ...draft, type: e.target.value })}
          className="text-xs bg-white border border-zinc-200 rounded-md px-1.5 py-1.5 outline-none focus:border-indigo-400 text-indigo-600 cursor-pointer"
        >
          {DATATYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.isPK}
              onChange={(e) => setDraft({ ...draft, isPK: e.target.checked })}
              disabled={!canSetPrimaryKey && !draft.isPK}
              title={!canSetPrimaryKey && !draft.isPK ? "This table already has a primary key" : undefined}
              className="accent-indigo-500"
            />
            <span className={!canSetPrimaryKey && !draft.isPK ? "opacity-50" : undefined}>PK</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.isNullable}
              onChange={(e) =>
                setDraft({ ...draft, isNullable: e.target.checked })
              }
              className="accent-indigo-500"
            />
            Nullable
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.isUnique}
              onChange={(e) =>
                setDraft({ ...draft, isUnique: e.target.checked })
              }
              className="accent-indigo-500"
            />
            Unique
          </label>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600"
            title="Cancel (Esc)"
          >
            <X size={14} />
          </button>
          <button
            onClick={onSave}
            disabled={!draft.name.trim()}
            className="p-1 rounded hover:bg-indigo-100 text-indigo-500 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Save (Enter)"
          >
            <Check size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
