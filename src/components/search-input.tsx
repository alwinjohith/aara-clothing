"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const timerRef = useState<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedRef = useRef(value);

  const handleChange = useCallback(
    (val: string) => {
      setLocal(val);
      if (timerRef[0]) clearTimeout(timerRef[0]);
      timerRef[1](
        setTimeout(() => {
          onChange(val);
        }, debounceMs)
      );
    },
    [debounceMs, onChange, timerRef]
  );

  useEffect(() => {
    if (lastSyncedRef.current !== value) {
      lastSyncedRef.current = value;
      setLocal(value);
    }
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
