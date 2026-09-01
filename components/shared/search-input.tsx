"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchInput({
  placeholder = "Search…",
  paramKey = "searchTerm",
  className,
}: {
  placeholder?: string;
  paramKey?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [value, setValue] = useState(params.get(paramKey) ?? "");
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    if (debounced === (params.get(paramKey) ?? "")) return;
    const sp = new URLSearchParams(params);
    if (debounced) sp.set(paramKey, debounced);
    else sp.delete(paramKey);
    sp.delete("page");
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
