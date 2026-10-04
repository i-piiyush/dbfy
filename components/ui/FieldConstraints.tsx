"use client";

type Constraint = "isPK" | "isNullable" | "isUnique";

const constraints: { key: Constraint; label: string; description: string }[] = [
  { key: "isPK", label: "Primary key", description: "PK" },
  { key: "isNullable", label: "Nullable", description: "NULL" },
  { key: "isUnique", label: "Unique", description: "UNIQUE" },
];

export default function FieldConstraints({
  values,
  canSetPrimaryKey,
  onChange,
}: {
  values: Record<Constraint, boolean>;
  canSetPrimaryKey: boolean;
  onChange: (constraint: Constraint, checked: boolean) => void;
}) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-[11px] font-medium text-zinc-600">Constraints</legend>
      <div className="flex gap-1.5">
        {constraints.map(({ key, label, description }) => {
          const disabled = key === "isPK" && !canSetPrimaryKey && !values.isPK;
          return (
            <label
              key={key}
              title={disabled ? "This table already has a primary key" : undefined}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-[11px] font-medium transition-colors ${
                values[key]
                  ? "border-zinc-300 bg-zinc-100 text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              } ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
            >
              <input
                type="checkbox"
                checked={values[key]}
                disabled={disabled}
                onChange={(event) => onChange(key, event.target.checked)}
                className="sr-only"
              />
              <span>{label}</span>
              <span className="text-[9px] font-mono text-zinc-400">{description}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
