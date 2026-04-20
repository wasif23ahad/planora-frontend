"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { EventCard } from "@/components/events/EventCard";

export default function EventsListingPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, boolean>>({
    "public-free": false,
    "public-paid": false,
    "private-free": false,
    "private-paid": false,
  });
  const [sort, setSort] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events");
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const anyFilter = Object.values(filters).some(Boolean);
  const filtered = events.filter((e) => {
    const key = `${e.visibility}-${e.feeCents === 0 ? "free" : "paid"}`;
    const matchFilter = !anyFilter || filters[key];
    const matchSearch = !search || 
      e.title.toLowerCase().includes(search.toLowerCase()) || 
      e.owner?.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "fee") return a.feeCents - b.feeCents;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paged = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const toggleFilter = (k: string) => setFilters(f => ({ ...f, [k]: !f[k] }));

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted font-medium">Discovering events…</div>;

  return (
    <div className="bg-background min-h-screen pt-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-[36px] font-bold text-foreground font-tight tracking-[-0.03em] mb-1.5">All events</h1>
          <div className="text-[14px] text-muted">{filtered.length} events found</div>
        </div>

        {/* Search Bar */}
        <div className="mb-10 relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-[20px] pointer-events-none group-focus-within:text-accent transition-colors">⌕</span>
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by title or organizer…"
            className="w-full h-[44px] pl-11 pr-4 border border-border-base rounded-[10px] text-[14px] bg-white text-foreground font-inherit outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-10 items-start">
          {/* ── SIDEBAR ────────────────────────────────────── */}
          <aside className="bg-white rounded-[12px] border border-border-base p-6 sticky top-20 shadow-sm">
            <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">Category</div>
            {[
              { key: "public-free",  label: "Public Free" },
              { key: "public-paid",  label: "Public Paid" },
              { key: "private-free", label: "Private Free" },
              { key: "private-paid", label: "Private Paid" },
            ].map(f => (
              <label key={f.key} className="flex items-center gap-2 mb-3 cursor-pointer text-[14px] text-foreground hover:text-accent transition-colors">
                <input 
                  type="checkbox" 
                  checked={filters[f.key]} 
                  onChange={() => toggleFilter(f.key)}
                  className="accent-accent w-[15px] h-[15px]" 
                />
                {f.label}
              </label>
            ))}

            <div className="border-t border-border-base my-5" />

            <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">Sort by</div>
            {[
              { value: "date", label: "Date" },
              { value: "fee", label: "Fee (low to high)" }
            ].map(s => (
              <label key={s.value} className="flex items-center gap-2 mb-2.5 cursor-pointer text-[14px] text-foreground hover:text-accent transition-colors">
                <input 
                  type="radio" 
                  name="sort" 
                  checked={sort === s.value} 
                  onChange={() => setSort(s.value)}
                  className="accent-accent" 
                />
                {s.label}
              </label>
            ))}

            {anyFilter && (
              <>
                <div className="border-t border-border-base my-5" />
                <button 
                  onClick={() => setFilters({"public-free":false,"public-paid":false,"private-free":false,"private-paid":false})}
                  className="text-[13px] text-muted underline cursor-pointer hover:text-foreground transition-colors"
                >
                  Clear filters
                </button>
              </>
            )}
          </aside>

          {/* ── EVENT GRID ─────────────────────────────────── */}
          <div>
            {paged.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <div className="text-[32px] mb-3">○</div>
                <div className="text-[16px] font-medium mb-2 text-foreground">No events found</div>
                <div className="text-[14px]">Try adjusting your search or filters.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paged.map(e => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-2 mt-10 justify-center items-center">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 rounded-lg border border-border-base bg-white text-[13px] font-medium disabled:opacity-40 hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button 
                    key={n} 
                    onClick={() => setCurrentPage(n)}
                    className={`w-9 h-9 rounded-lg border text-[13px] font-bold transition-all cursor-pointer 
                      ${n === currentPage ? "bg-accent border-accent text-white" : "bg-white border-border-base text-foreground hover:border-accent"}`}
                  >
                    {n}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 rounded-lg border border-border-base bg-white text-[13px] font-medium disabled:opacity-40 hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
