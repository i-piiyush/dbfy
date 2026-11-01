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
    <div className="flex justify-end gap-2 border-t-2 border-ink pt-2.5">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-8 items-center gap-1.5 border-2 border-ink bg-paper px-2.5 text-xs font-black text-ink hover:bg-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <X size={13} />
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!canSave}
        className="inline-flex h-8 items-center gap-1.5 border-2 border-ink bg-acid px-3 text-xs font-black text-ink shadow-[3px_3px_0_var(--palette-ink)] hover:shadow-[2px_2px_0_var(--palette-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none"
      >
        <Check size={13} />
        Save field
      </button>
    </div>
  );
}
