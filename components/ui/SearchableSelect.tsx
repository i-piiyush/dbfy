"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SelectOption = { value: string; label: string };

export default function SearchableSelect({
  value,
  options,
  onValueChange,
  ariaLabel,
  triggerClassName,
}: {
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  ariaLabel: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openAbove, setOpenAbove] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      `${option.label} ${option.value}`.toLowerCase().includes(query),
    );
  }, [options, search]);

  function toggleOpen() {
    if (open) {
      setOpen(false);
      setSearch("");
      return;
    }
    const bounds = rootRef.current?.getBoundingClientRect();
    const roomBelow = bounds ? window.innerHeight - bounds.bottom : window.innerHeight;
    const roomAbove = bounds?.top ?? 0;
    setOpenAbove(roomBelow < 300 && roomAbove > roomBelow);
    setSearch("");
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative min-w-0 ${open ? "z-[9999]" : ""}`} onWheelCapture={(event) => event.stopPropagation()}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleOpen}
        className={`flex items-center justify-between gap-2 border-2 border-ink bg-paper px-2.5 py-1.5 text-xs font-black text-ink shadow-[2px_2px_0_var(--palette-ink)] hover:bg-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${triggerClassName ?? "w-[132px]"}`}
      >
        <span className="truncate">{selectedOption?.label ?? value}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-zinc-400 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-[10000] w-[min(14rem,calc(100vw-2rem))] border-2 border-ink bg-paper p-1.5 shadow-[4px_4px_0_var(--palette-ink)] ${openAbove ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}
        >
          <label className="mb-1.5 flex h-9 items-center gap-2 border-2 border-ink bg-canvas px-2">
            <Search size={13} strokeWidth={2.5} className="shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search types..."
              aria-label={`Search ${ariaLabel.toLowerCase()}`}
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-neutral-500"
            />
          </label>
          <div
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-[min(16rem,65vh)] overflow-y-auto overscroll-contain"
            onWheelCapture={(event) => event.stopPropagation()}
          >
          {filteredOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={`${option.value}-${option.label}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onValueChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center justify-between px-2.5 py-2 text-left text-xs font-bold ${
                  isSelected
                    ? "bg-acid text-ink"
                    : "text-ink hover:bg-violet"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={13} className="shrink-0" />}
              </button>
            );
          })}
          {filteredOptions.length === 0 && (
            <p className="px-2.5 py-3 text-xs font-bold text-neutral-600">No matching data types.</p>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
