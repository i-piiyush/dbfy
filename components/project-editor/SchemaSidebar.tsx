"use client";

import { Check, Clipboard, X } from "lucide-react";
import { motion } from "motion/react";
import SchemaCodeViewer from "@/components/SchemaCodeViewer";
import type { SchemaFormat } from "@/lib/schema-options";

export default function SchemaSidebar({
  format,
  copied,
  code,
  onCopy,
  onClose,
}: {
  format: SchemaFormat;
  copied: boolean;
  code: string;
  onCopy: () => void;
  onClose: () => void;
}) {
  const title = format === "sql" ? "SQL schema" : "Prisma schema";

  return (
    <>
      <button aria-label="Close Prisma schema sidebar" className="fixed inset-0 z-20 cursor-default bg-black/20" onClick={onClose} />
      <motion.aside
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        aria-label={title}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l-[3px] border-ink bg-paper shadow-2xl"
      >
        <header className="flex items-center justify-between border-b-[3px] border-ink bg-violet px-5 py-4">
          <div>
            <h2 className="text-base font-black text-ink">{title}</h2>
            <p className="mt-1 text-xs font-medium text-neutral-600">Generated from your current diagram</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onCopy} className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-3 py-2 text-sm font-black text-paper shadow-[3px_3px_0_var(--palette-purple)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-purple)]">
              {copied ? <Check size={16} /> : <Clipboard size={16} />}
              {copied ? "Copied" : "Copy schema"}
            </button>
            <button onClick={onClose} aria-label="Close sidebar" className="border-2 border-transparent p-2 text-ink hover:border-ink hover:bg-coral">
              <X size={18} />
            </button>
          </div>
        </header>
        <SchemaCodeViewer
          language={format}
          code={code || (format === "sql"
            ? "-- Add a table to generate your SQL schema."
            : "// Add a table to generate your Prisma schema.")}
        />
      </motion.aside>
    </>
  );
}
