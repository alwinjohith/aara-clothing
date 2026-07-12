"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, X } from "lucide-react";

interface SearchableSelectItem {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  items: SearchableSelectItem[];
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function SearchableSelect({
  value,
  onChange,
  placeholder = "Search...",
  items,
  disabled,
  className,
  emptyMessage = "No results found",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedItem = items.find((i) => i.value === value);

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback(
    (val: string) => {
      onChange?.(val === value ? "" : val);
      setQuery("");
      setOpen(false);
    },
    [onChange, value]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen(!open);
        }}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-input bg-muted/30 px-3 py-2 pr-8 text-sm shadow-sm transition-all duration-200",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary/50 focus-visible:bg-muted/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-ring/30 border-primary/50 bg-muted/50"
        )}
      >
        <span className={cn("truncate", !selectedItem && "text-muted-foreground")}>
          {selectedItem?.label ?? placeholder}
        </span>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-elevated animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="h-11 w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleSelect(item.value)}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    item.value === value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
