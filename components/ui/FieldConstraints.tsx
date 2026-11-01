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
      <legend className="text-[11px] font-black uppercase tracking-wide text-ink">Constraints</legend>
      <div className="flex gap-1.5">
        {constraints.map(({ key, label, description }) => {
          const disabled = key === "isPK" && !canSetPrimaryKey && !values.isPK;
          return (
            <label
              key={key}
              title={disabled ? "This table already has a primary key" : undefined}
              className={`inline-flex h-8 items-center gap-1.5 border-2 border-ink px-2 text-[11px] font-black ${
                values[key]
                  ? "bg-violet text-ink"
                  : "bg-paper text-ink hover:bg-lemon"
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
              <span className="font-mono text-[9px]">{description}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
