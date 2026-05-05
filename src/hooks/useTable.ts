import { useMemo, useState } from "react";

export interface TableFilter<T> {
  searchKeys?: (keyof T | string)[];
  pageSize?: number;
}

export function useTable<T extends Record<string, any>>(rows: T[], opts: TableFilter<T> = {}) {
  const { searchKeys = [], pageSize = 10 } = opts;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      searchKeys.some((k) => {
        const segs = String(k).split(".");
        let v: any = row;
        for (const seg of segs) {
          if (v == null) break;
          v = v?.[seg];
        }
        return v != null && String(v).toLowerCase().includes(q);
      })
    );
  }, [rows, search, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  
  const sliced = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  return {
    search, 
    setSearch,
    page: safePage, 
    setPage,
    totalPages,
    rows: sliced,
    total: filtered.length,
    pageSize,
  };
}
