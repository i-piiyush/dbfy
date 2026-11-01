"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";

export default function NeoDialog({
  open,
  title,
  description,
  onClose,
  closeDisabled = false,
  unframed = false,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  closeDisabled?: boolean;
  unframed?: boolean;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !closeDisabled) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeDisabled, onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/65 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !closeDisabled) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={unframed ? title : undefined}
        aria-labelledby={unframed ? undefined : titleId}
        aria-describedby={!unframed && description ? descriptionId : undefined}
        className={unframed ? "my-auto w-full" : "my-auto w-full max-w-md border-[3px] border-ink bg-canvas p-5 text-ink shadow-[8px_8px_0_var(--palette-ink)] sm:p-7"}
      >
        {!unframed && <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-2xl font-black tracking-[-0.05em]">{title}</h2>
            {description && <p id={descriptionId} className="mt-1 text-sm font-medium leading-6 text-neutral-600">{description}</p>}
          </div>
          <button
            type="button"
            disabled={closeDisabled}
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 place-items-center border-2 border-ink bg-paper hover:bg-pink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </header>}
        {children}
      </section>
    </div>
  );
}
