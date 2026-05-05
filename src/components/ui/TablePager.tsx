"use client";
import React from "react";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}

export function TablePager({ page, totalPages, total, pageSize, onChange }: Props) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/30 text-sm bg-surface-container-low/20">
      <span className="text-secondary text-[11px] font-bold uppercase tracking-widest tabular-nums">
        Showing <span className="text-on-surface">{start}–{end}</span> of <span className="text-on-surface">{total}</span>
      </span>
      <nav className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-9 h-9 rounded-xl border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        
        <div className="flex items-center gap-2 text-on-surface font-headline font-bold text-xs tabular-nums bg-surface-container-lowest px-4 py-2 rounded-lg border border-outline-variant/30">
          <span>{page}</span>
          <span className="opacity-30">/</span>
          <span className="opacity-50">{totalPages}</span>
        </div>

        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-9 h-9 rounded-xl border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
