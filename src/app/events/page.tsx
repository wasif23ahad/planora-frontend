"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { EventCard } from "@/components/events/EventCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    public: true,
    private: true,
    free: true,
    paid: true,
  });
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In a real app, we'd pass filters to the API. 
        // For now, we'll fetch all and filter client-side for simplicity, 
        // or just fetch with a high limit.
        const res = await api.get("/events?limit=100");
        setEvents(res.data.items ?? []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                         e.description?.toLowerCase().includes(search.toLowerCase());
    
    const feeAmount = e.fee ?? (e.feeCents ? e.feeCents / 100 : 0);
    const isPublic = e.visibility?.toLowerCase() === "public";
    const isPrivate = e.visibility?.toLowerCase() === "private";
    const isFree = feeAmount === 0;
    const isPaid = feeAmount > 0;

    const matchesVisibility = (isPublic && filters.public) || (isPrivate && filters.private);
    const matchesFee = (isFree && filters.free) || (isPaid && filters.paid);

    return matchesSearch && matchesVisibility && matchesFee;
  }).sort((a, b) => {
    if (sortBy === "date") return new Date(a.date).getTime() - new Date(b.date).getTime();
    const feeA = a.fee ?? (a.feeCents ? a.feeCents / 100 : 0);
    const feeB = b.fee ?? (b.feeCents ? b.feeCents / 100 : 0);
    if (sortBy === "fee-low") return feeA - feeB;
    if (sortBy === "fee-high") return feeB - feeA;
    return 0;
  });

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
      
      {/* ── SIDEBAR FILTERS ────────────────────────────────── */}
      <aside className="md:col-span-3 space-y-10">
        <div className="sticky top-28">
          <h2 className="font-headline text-2xl font-semibold mb-8 text-on-surface">Experience Filters</h2>
          
          <div className="space-y-8">
            {/* Visibility Group */}
            <div className="space-y-4">
              <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">Access</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.public}
                    onChange={(e) => setFilters({...filters, public: e.target.checked})}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Public Events</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.private}
                    onChange={(e) => setFilters({...filters, private: e.target.checked})}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Private Events</span>
                </label>
              </div>
            </div>

            {/* Fee Group */}
            <div className="space-y-4">
              <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">Registration</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.free}
                    onChange={(e) => setFilters({...filters, free: e.target.checked})}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Free Entry</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.paid}
                    onChange={(e) => setFilters({...filters, paid: e.target.checked})}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Paid Entry</span>
                </label>
              </div>
            </div>

            <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setFilters({public: true, private: true, free: true, paid: true})}
            >
                Reset Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <section className="md:col-span-9 space-y-12">
        
        {/* Toolbar: Search & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Discover Events</h1>
            <p className="text-secondary text-sm font-medium">Showing {filteredEvents.length} upcoming experiences</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 grow max-w-xl">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, topic, or host..."
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary focus:ring-0 outline-none transition-all ambient-shadow"
              />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-medium text-on-surface focus:border-primary outline-none appearance-none cursor-pointer ambient-shadow min-w-[160px]"
            >
              <option value="date">Soonest First</option>
              <option value="fee-low">Price: Low to High</option>
              <option value="fee-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[400px] bg-surface-container-low animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/50">
            <span className="material-symbols-outlined text-[64px] text-secondary/30">event_busy</span>
            <div className="space-y-1">
               <h3 className="font-headline text-xl font-semibold text-on-surface">No events found</h3>
               <p className="text-secondary text-sm max-w-xs">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => {setSearch(""); setFilters({public: true, private: true, free: true, paid: true});}}>
               Clear all filters
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}