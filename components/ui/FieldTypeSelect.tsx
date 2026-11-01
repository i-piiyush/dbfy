"use client";

import SearchableSelect from "@/components/ui/SearchableSelect";
import type { SelectOption } from "@/components/ui/SearchableSelect";

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
      <SearchableSelect
        ariaLabel="Field data type"
        triggerClassName="w-full"
        value={value}
        options={options}
        onValueChange={onChange}
      />
    </label>
  );
}
