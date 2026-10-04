"use client";

import { Check, X } from "lucide-react";

export default function FieldFormActions({
  canSave,
  onSave,
  onCancel,
}: {
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-zinc-100 pt-2.5">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
      >
        <X size={13} />
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!canSave}
        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-xs font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Check size={13} />
        Save field
      </button>
    </div>
  );
}
