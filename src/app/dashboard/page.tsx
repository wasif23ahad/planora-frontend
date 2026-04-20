"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/Pill";

export default function DashboardPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events/me")
      .then(({ data }) => setEvents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-12 text-[14px] text-muted">Loading…</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em]">My Events</h1>
        <Link href="/dashboard/events/new">
          <Button variant="primary">+ Create event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-base rounded-[12px] text-muted">
          <div className="text-[15px] mb-2">No events yet</div>
          <div className="text-[13px]">Create your first event to get started.</div>
        </div>
      ) : (
        <div className="bg-white rounded-[12px] border border-border-base overflow-hidden">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-border-base bg-background">
                {["Event", "Date", "Status", "Participants", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-muted uppercase tracking-[0.05em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr
                  key={ev.id}
                  className="border-b border-border-base last:border-0 hover:bg-[#F9F9F7] transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium text-foreground">{ev.title}</td>
                  <td className="px-4 py-3.5 text-muted tabular-nums">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3.5"><StatusPill status={ev.isFeatured ? "featured" : "approved"} /></td>
                  <td className="px-4 py-3.5 text-muted">
                    {ev._count?.participations ?? 0}
                    {(ev._count?.pendingParticipations ?? 0) > 0 && (
                      <span className="ml-2 bg-[#FEF3C7] text-[#B4600E] text-[11px] px-1.5 py-0.5 rounded-[20px] font-semibold">
                        {ev._count.pendingParticipations} pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/events/${ev.id}`}>
                        <Button variant="secondary" small>Manage</Button>
                      </Link>
                      <Link href={`/dashboard/events/${ev.id}/edit`}>
                        <Button variant="ghost" small>Edit</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
