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
      <span className="block text-[11px] font-black uppercase tracking-wide text-ink">Field name</span>
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
        className="h-9 w-full border-2 border-ink bg-paper px-2.5 text-[13px] font-semibold text-ink outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-brand"
      />
    </label>
  );
}
