"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { CategoryPill, StatusPill } from "@/components/ui/Pill";
import { TablePager } from "@/components/ui/TablePager";
import { useTable } from "@/hooks/useTable";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EventModerationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, statsRes] = await Promise.all([
          api.get("/admin/events"),
          api.get("/admin/stats")
        ]);
        setEvents(evRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load management data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this event and all associated participation records? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Internal deletion failure");
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      const { data } = await api.patch(`/admin/events/${id}/feature`);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, isFeatured: data.isFeatured } : e));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Feature toggle failure");
    }
  };

  // 1. Apply category filter
  const filteredEvents = events.filter(e => 
    categoryFilter === "all" ? true : e.category === categoryFilter
  );

  // 2. Apply table logic
  const t = useTable(filteredEvents, {
    searchKeys: ["title", "owner.name", "category", "venue"],
    pageSize: 10
  });

  if (loading) return <div className="py-24 text-center text-secondary animate-pulse font-headline">Loading management metrics...</div>;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Event Moderation</h1>
        <p className="text-secondary mt-1">Audit and manage all community experiences across the platform.</p>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Community Experiences", value: stats?.totalEvents || events.length, color: "text-primary", bg: "bg-primary/5" },
          { label: "Featured Picks", value: events.filter(e => e.isFeatured).length, color: "text-accent", bg: "bg-accent/5" },
          { label: "Platform Revenue", value: `৳${((stats?.totalRevenue || 0) / 100).toLocaleString()}`, color: "text-success", bg: "bg-success/5" },
          { label: "Total Registrations", value: events.reduce((a, e) => a + (e._count?.participations ?? 0), 0), color: "text-on-surface", bg: "bg-surface-container" },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border border-outline-variant/10 p-6 flex flex-col gap-2 ambient-shadow ${s.bg}`}>
            <div className={`text-3xl font-headline font-bold tabular-nums ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative grow w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
          <input
            value={t.search}
            onChange={(e) => { t.setSearch(e.target.value); t.setPage(1); }}
            placeholder="Search title, host, or category…"
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); t.setPage(1); }}
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none cursor-pointer font-semibold min-w-[160px]"
        >
          <option value="all">All Categories</option>
          {Array.from(new Set(events.map(e => e.category))).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden ambient-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              <tr>
                <th className="px-8 py-5">Event</th>
                <th className="px-8 py-5">Host</th>
                <th className="px-8 py-5 text-center">Type</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Reach</th>
                <th className="px-8 py-5 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {t.rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-24 text-secondary">
                    <div className="flex flex-col items-center gap-4">
                      <span className="material-symbols-outlined text-[48px] opacity-20">event_busy</span>
                      <p>No experiences match your current search or filters.</p>
                      <Button variant="outline" size="sm" onClick={() => { t.setSearch(""); setCategoryFilter("all"); }}>Clear Filters</Button>
                    </div>
                  </td>
                </tr>
              ) : t.rows.map(ev => (
                <tr key={ev.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-headline font-bold text-on-surface text-base">{ev.title}</div>
                    <div className="text-secondary text-xs mt-1">{new Date(ev.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td className="px-8 py-6 text-on-surface-variant font-medium">{ev.owner?.name}</td>
                  <td className="px-8 py-6 text-center">
                     <CategoryPill type={ev.visibility} fee={ev.fee} />
                  </td>
                  <td className="px-8 py-6">
                    {ev.isFeatured ? <StatusPill status="featured" /> : <StatusPill status="approved" />}
                  </td>
                  <td className="px-8 py-6 text-right tabular-nums font-headline font-bold text-secondary">
                     {ev._count?.participations ?? 0}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleFeature(ev.id)}
                        className={`material-symbols-outlined w-10 h-10 rounded-full flex items-center justify-center transition-all border
                          ${ev.isFeatured 
                            ? "bg-accent/10 border-accent/20 text-accent fill-1" 
                            : "bg-surface-container border-outline-variant/20 text-secondary hover:text-accent hover:border-accent hover:bg-accent/5"}`}
                        title={ev.isFeatured ? "Unfeature" : "Feature on Homepage"}
                      >
                         {ev.isFeatured ? "star" : "grade"}
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(ev.id)}
                          className="material-symbols-outlined w-10 h-10 rounded-full flex items-center justify-center text-error bg-error/5 border border-error/20 hover:bg-error/15 transition-all"
                          title="Delete Event Permanently"
                        >
                           delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePager 
          page={t.page} 
          totalPages={t.totalPages} 
          total={t.total} 
          pageSize={t.pageSize} 
          onChange={t.setPage} 
        />
      </div>
    </div>
  );
}
