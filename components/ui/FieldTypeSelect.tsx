"use client";

import AppleSelect from "@/components/ui/AppleSelect";
import type { SelectOption } from "@/components/ui/AppleSelect";

export default function FieldTypeSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="w-[116px] shrink-0 space-y-1.5">
      <span className="block text-[11px] font-medium text-zinc-600">Type</span>
      <AppleSelect
        ariaLabel="Field data type"
        triggerClassName="w-full"
        value={value}
        options={options}
        onValueChange={onChange}
      />
    </label>
  );
}
