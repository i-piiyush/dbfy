"use client";

import AppleSelect from "@/components/ui/AppleSelect";
import type { SelectOption } from "@/components/ui/AppleSelect";

export type GeneratedId = "autoincrement" | "uuid" | undefined;

export default function FieldGenerationSelect({
  value,
  supportsAutoIncrement,
  supportsUuidGeneration,
  onChange,
}: {
  value: GeneratedId;
  supportsAutoIncrement: boolean;
  supportsUuidGeneration: boolean;
  onChange: (value: GeneratedId) => void;
}) {
  const options: SelectOption[] = [
    { value: "", label: "None" },
    ...(supportsAutoIncrement
      ? [{ value: "autoincrement", label: "Auto-increment" }]
      : []),
    ...(supportsUuidGeneration
      ? [{ value: "uuid", label: "Generate UUID" }]
      : []),
  ];

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-200/80 bg-zinc-50/70 px-2.5 py-2">
      <div>
        <p className="text-xs font-medium text-zinc-800">Generated value</p>
        <p className="mt-0.5 text-[10px] text-zinc-500">Set a default for this field</p>
      </div>
      <AppleSelect
        ariaLabel="Generated value"
        value={value ?? ""}
        options={options}
        onValueChange={(nextValue) =>
          onChange(nextValue === "" ? undefined : nextValue as GeneratedId)
        }
      />
    </div>
  );
}
