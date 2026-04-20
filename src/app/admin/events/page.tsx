"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { CategoryPill, StatusPill } from "@/components/ui/Pill";
import api from "@/lib/api";

export default function EventModerationPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/events")
      .then(({ data }) => setEvents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this event and all its data?")) return;
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Delete failed");
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      const { data } = await api.patch(`/admin/events/${id}/feature`);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, isFeatured: data.isFeatured } : e));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Toggle failed");
    }
  };

  if (loading) return <div className="py-24 text-center text-muted animate-pulse">Loading events…</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] mb-1">All Events</h1>
          <div className="text-[14px] text-muted">{events.length} total events</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total events", value: events.length },
          { label: "Featured", value: events.filter(e => e.isFeatured).length },
          { label: "Public", value: events.filter(e => e.visibility === "PUBLIC").length },
          { label: "Total participants", value: events.reduce((a, e) => a + (e._count?.participations ?? 0), 0) },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[12px] border border-border-base p-5">
            <div className="text-[24px] font-bold text-foreground tabular-nums">{s.value}</div>
            <div className="text-[13px] text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[12px] border border-border-base overflow-hidden">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-background border-b border-border-base">
              {["Event", "Organizer", "Type", "Status", "Participants", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-[12px] font-semibold text-muted uppercase tracking-[0.05em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} className="border-b border-border-base hover:bg-[#F9F9F7] transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{ev.title}</div>
                  <div className="text-[12px] text-muted">{new Date(ev.date).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3 text-muted">{ev.owner?.name}</td>
                <td className="px-4 py-3"><CategoryPill type={ev.visibility === "PUBLIC" ? "public" : "private"} feeCents={ev.feeCents} /></td>
                <td className="px-4 py-3">
                  {ev.isFeatured ? <StatusPill status="featured" /> : <StatusPill status="approved" />}
                </td>
                <td className="px-4 py-3 text-muted tabular-nums">{ev._count?.participations ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleToggleFeature(ev.id)}
                      className={`text-[12px] px-2.5 py-1 rounded-md border cursor-pointer font-medium transition-colors
                        ${ev.isFeatured ? "bg-[#EDE9FF] text-accent border-[#EDE9FF]" : "bg-transparent text-muted border-border-base hover:border-accent"}`}
                    >
                      {ev.isFeatured ? "★ Featured" : "☆ Feature"}
                    </button>
                    <Button variant="danger" small onClick={() => handleDelete(ev.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
