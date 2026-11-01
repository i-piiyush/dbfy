"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { SchemaFormat } from "@/lib/data";

const neoLightTheme = {
  name: "dbfy-neo-light",
  type: "light" as const,
  colors: {
    "editor.background": "#f7f4ed",
    "editor.foreground": "#171717",
  },
  settings: [
    { settings: { foreground: "#171717" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#777166", fontStyle: "italic" } },
    { scope: ["keyword", "keyword.control", "storage.type"], settings: { foreground: "#7156ff", fontStyle: "bold" } },
    { scope: ["entity.name.type", "support.type", "entity.name.class"], settings: { foreground: "#087a61", fontStyle: "bold" } },
    { scope: ["string", "string.quoted"], settings: { foreground: "#b33c72" } },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#b45418" } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: "#075e9a" } },
    { scope: ["keyword.operator", "punctuation"], settings: { foreground: "#4d4a43" } },
  ],
};

export default function SchemaCodeViewer({
  code,
  language,
}: {
  code: string;
  language: SchemaFormat;
}) {
  const [highlighted, setHighlighted] = useState<{
    code: string;
    language: SchemaFormat;
    html: string;
  } | null>(null);
  const lineCount = Math.max(code.split("\n").length, 1);

  useEffect(() => {
    let active = true;
    void codeToHtml(code, { lang: language, theme: neoLightTheme })
      .then((html) => {
        if (active) setHighlighted({ code, language, html });
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [code, language]);

  return (
    <section aria-label={`${language.toUpperCase()} schema code`} className="flex min-h-0 flex-1 flex-col overflow-hidden border-t-[3px] border-ink bg-canvas text-ink">
      <div className="flex h-11 shrink-0 items-center justify-between border-b-2 border-ink bg-paper px-4">
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 border border-black/30 bg-coral" />
            <span className="size-2.5 border border-black/30 bg-acid" />
            <span className="size-2.5 border border-black/30 bg-sky" />
          </div>
          <span className="font-mono text-[11px] font-bold text-ink">
            schema.{language === "sql" ? "sql" : "prisma"}
          </span>
        </div>
        <span className="border border-ink/30 bg-canvas px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink">
          {language}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-h-full min-w-max">
          <ol aria-hidden="true" className="sticky left-0 z-10 m-0 min-h-full shrink-0 list-none border-r-2 border-ink bg-paper px-3 py-4 text-right font-mono text-[13px] leading-6 text-neutral-500">
            {Array.from({ length: lineCount }, (_, index) => (
              <li key={index}>{index + 1}</li>
            ))}
          </ol>
          <div className="min-w-0 px-4 py-4 font-mono text-[13px] [&_pre]:!m-0 [&_pre]:!min-w-max [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!leading-6 [&_code]:!leading-6">
            {highlighted?.code === code && highlighted.language === language ? (
              <div dangerouslySetInnerHTML={{ __html: highlighted.html }} />
            ) : (
                <pre className="m-0 min-w-max whitespace-pre leading-6 text-ink">
                <code>{code}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
