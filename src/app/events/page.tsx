"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { EventCard, EventData } from "@/components/events/EventCard";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "public-free", label: "Public Free" },
  { value: "public-paid", label: "Public Paid" },
  { value: "private-free", label: "Private Free" },
  { value: "private-paid", label: "Private Paid" },
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "featured", label: "Featured First" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "price_low", label: "Price: Low to High" },
];

export default function EventsListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get("q") || "");

  // Params
  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "recent";
  const limit = 9;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "all") params.append("category", category);
      params.append("sort", sort);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const { data } = await api.get(`/events?${params.toString()}`);
      setEvents(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle filter changes
  const updateParams = (newParams: Record<string, string>) => {
    const fresh = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) fresh.set(key, value);
      else fresh.delete(key);
    });
    fresh.set("page", "1"); // Reset to page 1 on filter
    router.push(`/events?${fresh.toString()}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-background min-h-screen py-16 px-8">
      <div className="max-w-[1200px] mx-auto">
        <SectionTitle>Discover events</SectionTitle>

        {/* ── FILTERS & SEARCH ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12 items-end">
          <div className="lg:col-span-2">
            <Input
              label="Search"
              placeholder="Search by title or venue..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // Debounce would be better, but this handles simple real-time
                const fresh = new URLSearchParams(searchParams.toString());
                if (e.target.value) fresh.set("q", e.target.value);
                else fresh.delete("q");
                fresh.set("page", "1");
                router.push(`/events?${fresh.toString()}`);
              }}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => updateParams({ category: e.target.value })}
              className="w-full h-[42px] px-3.5 border border-border-base rounded-lg text-[14px] bg-white outline-none focus:border-accent"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground">Sort By</label>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="w-full h-[42px] px-3.5 border border-border-base rounded-lg text-[14px] bg-white outline-none focus:border-accent"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── GRID ──────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[300px] bg-muted/5 rounded-radius-card border border-border-base" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-2xl border border-border-base shadow-sm">
            <div className="text-[20px] mb-2">🔍</div>
            <p className="text-muted text-[14px] font-medium">No events matches your search or filters.</p>
            <button 
              onClick={() => router.push("/events")} 
              className="mt-4 text-accent font-bold text-[13px] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* ── PAGINATION ─────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => updateParams({ page: pageNum.toString() })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold transition-all
                      ${page === pageNum 
                        ? "bg-accent text-white shadow-sm" 
                        : "bg-white border border-border-base text-muted hover:border-accent hover:text-accent"}
                    `}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
