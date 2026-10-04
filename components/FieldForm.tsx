"use client";

import {
  PRISMA_DATATYPES,
  SQL_DATATYPES,
} from "@/lib/data";
import type { SchemaFormat } from "@/lib/data";
import type { DraftField } from "@/types/tableNode.type";
import FieldConstraints from "@/components/ui/FieldConstraints";
import FieldFormActions from "@/components/ui/FieldFormActions";
import FieldGenerationSelect from "@/components/ui/FieldGenerationSelect";
import FieldNameInput from "@/components/ui/FieldNameInput";
import FieldTypeSelect from "@/components/ui/FieldTypeSelect";

export default function FieldForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  canSetPrimaryKey = true,
  schemaFormat,
}: {
  draft: DraftField;
  setDraft: (draft: DraftField) => void;
  onSave: () => void;
  onCancel: () => void;
  canSetPrimaryKey?: boolean;
  schemaFormat: SchemaFormat;
}) {
  const datatypes = schemaFormat === "sql"
    ? SQL_DATATYPES
    : PRISMA_DATATYPES.map((type) => ({ value: type, label: type }));
  const selectedType = datatypes.some(({ value }) => value === draft.type)
    ? draft.type
    : datatypes[0]?.value;
  const supportsAutoIncrement = ["Int", "BigInt"].includes(selectedType);
  const supportsUuidGeneration = selectedType === "UUID";

  return (
    <div
      className="space-y-3 border-t border-zinc-200 bg-white px-3 py-3 text-zinc-900"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <div className="flex items-end gap-2">
        <FieldNameInput
          value={draft.name}
          onChange={(name) => setDraft({ ...draft, name })}
          onSave={onSave}
          onCancel={onCancel}
        />
        <FieldTypeSelect
          value={selectedType}
          options={datatypes}
          onChange={(type) => setDraft({ ...draft, type, generatedId: undefined })}
        />
      </div>

      {(supportsAutoIncrement || supportsUuidGeneration) && (
        <FieldGenerationSelect
          value={draft.generatedId}
          supportsAutoIncrement={supportsAutoIncrement}
          supportsUuidGeneration={supportsUuidGeneration}
          onChange={(generatedId) => setDraft({ ...draft, generatedId })}
        />
      )}

      <FieldConstraints
        values={{
          isPK: draft.isPK,
          isNullable: draft.isNullable,
          isUnique: draft.isUnique,
        }}
        canSetPrimaryKey={canSetPrimaryKey}
        onChange={(constraint, checked) =>
          setDraft({ ...draft, [constraint]: checked })
        }
      />

      <FieldFormActions
        canSave={Boolean(draft.name.trim())}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}
