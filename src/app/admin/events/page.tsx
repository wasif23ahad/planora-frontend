"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CategoryPill } from "@/components/ui/Pill";
import api from "@/lib/api";

export default function EventModerationPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/admin/events");
        setEvents(data);
      } catch (error) {
        console.error("Failed to load global events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This event and all its data (participations, reviews) will be permanently deleted.")) return;
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  if (loading) return <div className="py-24 text-center text-muted animate-pulse">Scanning global event directory...</div>;

  return (
    <div className="space-y-10">
      <SectionTitle>Event Moderation</SectionTitle>

      <div className="bg-white border border-border-base rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/5 border-b border-border-base">
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Owner</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Visibility</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Attendees</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-foreground text-[14px]">{e.title}</div>
                  <div className="text-[12px] text-muted">{new Date(e.date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[14px] font-medium text-foreground">{e.owner.name}</div>
                  <div className="text-[11px] text-muted">{e.owner.email}</div>
                </td>
                <td className="px-6 py-4">
                  <CategoryPill type={e.visibility === "PUBLIC" ? "public" : "private"} feeCents={e.feeCents} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-accent">{e._count.participations}</span>
                    <span className="text-[11px] text-muted uppercase font-bold tracking-widest">People</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="danger" small onClick={() => handleDelete(e.id)}>Force Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
