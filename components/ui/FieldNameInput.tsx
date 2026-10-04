"use client";

export default function FieldNameInput({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <label className="min-w-0 flex-1 space-y-1.5">
      <span className="block text-[11px] font-medium text-zinc-600">Field name</span>
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && value.trim()) onSave();
          if (event.key === "Escape") onCancel();
        }}
        placeholder="field_name"
        className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[13px] text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
      />
    </label>
  );
}
