"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 12;

const CATEGORIES = ["Technology", "Coding", "Networking", "Food", "Arts", "Sports", "Culture", "Business"];

function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // controlled inputs reflect URL state
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [visibility, setVisibility] = useState<"all" | "PUBLIC" | "PRIVATE">((searchParams.get("visibility") as any) ?? "all");
  const [fee, setFee] = useState<"all" | "free" | "paid">((searchParams.get("fee") as any) ?? "all");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "date_asc");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

  const buildCategoryParam = useMemo(() => {
    // If both visibility + fee + no category -> use compound key the backend understands
    if (!category && visibility !== "all" && fee !== "all") {
      const v = visibility.toLowerCase();
      const f = fee;
      return `${v}-${f}`;
    }
    return category;
  }, [category, visibility, fee]);

  // Sync URL on change
  useEffect(() => {
    const sp = new URLSearchParams();
    if (search) sp.set("q", search);
    if (category) sp.set("category", category);
    if (visibility !== "all") sp.set("visibility", visibility);
    if (fee !== "all") sp.set("fee", fee);
    if (sort !== "date_asc") sp.set("sort", sort);
    if (page > 1) sp.set("page", String(page));
    router.replace(`/events${sp.toString() ? `?${sp.toString()}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, visibility, fee, sort, page]);

  // Fetch
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const params: Record<string, any> = { page, limit: PAGE_SIZE, upcoming: true, sort };
        if (search) params.q = search;
        if (buildCategoryParam) params.category = buildCategoryParam;

        const { data } = await api.get("/events", { params });
        setEvents(data.items ?? []);
        setTotal(data.total ?? 0);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }, 200); // debounce search
    return () => clearTimeout(t);
  }, [search, buildCategoryParam, sort, page]);

  // Apply visibility/fee client-side ONLY when category is a literal value
  // (compound keys already encode visibility+fee on the server)
  const visible = useMemo(() => {
    if (!category) return events;
    return events.filter(e => {
      const isPublic = e.visibility === "PUBLIC";
      const feeAmount = e.feeCents ? e.feeCents / 100 : (e.fee ?? 0);
      const isFree = feeAmount === 0;
      const visOk = visibility === "all" || (visibility === "PUBLIC" ? isPublic : !isPublic);
      const feeOk = fee === "all" || (fee === "free" ? isFree : !isFree);
      return visOk && feeOk;
    });
  }, [events, category, visibility, fee]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const setPage = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(p));
    router.replace(`/events?${sp.toString()}`, { scroll: false });
  };

  const reset = () => {
    setSearch("");
    setCategory("");
    setVisibility("all");
    setFee("all");
    setSort("date_asc");
    setPage(1);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">

      {/* Sidebar filters */}
      <aside className="md:col-span-3 space-y-10">
        <div className="md:sticky md:top-28 space-y-8">
          <h2 className="font-headline text-2xl font-semibold text-on-surface">Filters</h2>

          {/* Category */}
          <div className="space-y-3">
            <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">Category</h3>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
            >
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">Access</h3>
            <div className="flex flex-col gap-2">
              {(["all","PUBLIC","PRIVATE"] as const).map(v => (
                <label key={v} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === v}
                    onChange={() => { setVisibility(v); setPage(1); }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-on-surface">{v === "all" ? "All" : v === "PUBLIC" ? "Public" : "Private"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fee */}
          <div className="space-y-3">
            <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">Registration</h3>
            <div className="flex flex-col gap-2">
              {(["all","free","paid"] as const).map(f => (
                <label key={f} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="fee"
                    checked={fee === f}
                    onChange={() => { setFee(f); setPage(1); }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-on-surface">{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full" onClick={reset}>Reset filters</Button>
        </div>
      </aside>

      {/* Main */}
      <section className="md:col-span-9 space-y-12">

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-headline text-4xl font-semibold tracking-tighter text-on-surface">Discover events</h1>
            <p className="text-secondary text-sm font-medium">Showing {visible.length} of {total} upcoming experiences</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 grow max-w-xl">
            <div className="relative grow">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by title or description…"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary outline-none transition-all ambient-shadow"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm font-medium text-on-surface focus:border-primary outline-none cursor-pointer ambient-shadow min-w-[160px]"
            >
              <option value="date_asc">Soonest first</option>
              <option value="date_desc">Latest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] bg-surface-container-low animate-pulse rounded-xl" />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visible.map((e) => <EventCard key={e.id} event={e} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:text-on-surface disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                  const p = i + 1;
                  const active = p === page;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-full text-sm font-medium ${active ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container-low"}`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:text-on-surface disabled:opacity-30"
                  aria-label="Next page"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 bg-surface-container-low/50 rounded-2xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-[64px] text-secondary/30">event_busy</span>
            <h3 className="font-headline text-xl font-semibold text-on-surface">No events found</h3>
            <p className="text-secondary text-sm max-w-xs">Try adjusting your filters or search terms.</p>
            <Button variant="primary" size="sm" onClick={reset}>Clear all filters</Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function EventsPageWrapper() {
  return (
    <React.Suspense fallback={<div className="py-32 text-center text-secondary">Loading events…</div>}>
      <EventsPage />
    </React.Suspense>
  );
}