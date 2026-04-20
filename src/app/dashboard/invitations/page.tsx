"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/Pill";
import api from "@/lib/api";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const { data } = await api.get("/invitations");
        setInvitations(data);
      } catch (error) {
        console.error("Failed to load invitations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

  const handleRespond = async (id: string, status: "ACCEPTED" | "DECLINED") => {
    try {
      await api.patch(`/invitations/${id}`, { status });
      setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    } catch (error) {
      console.error("Failed to respond to invitation:", error);
    }
  };

  if (loading) return <div className="py-24 text-center text-muted animate-pulse">Loading choices...</div>;

  return (
    <div className="max-w-[800px] mx-auto">
      <SectionTitle>My invitations</SectionTitle>

      <div className="space-y-6">
        {invitations.length === 0 ? (
          <div className="py-24 text-center bg-white border border-border-base rounded-2xl shadow-sm space-y-4">
            <div className="text-[32px]">📭</div>
            <p className="text-muted text-[14px]">You don't have any invitations at the moment.</p>
            <Link href="/events">
              <Button variant="secondary">Browse Public Events</Button>
            </Link>
          </div>
        ) : (
          invitations.map((inv) => (
            <div key={inv.id} className="bg-white border border-border-base rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm group hover:border-accent transition-colors">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[18px]">📩</span>
                  <h3 className="text-[18px] font-bold text-foreground font-tight tracking-tight leading-tight">
                    {inv.event.title}
                  </h3>
                  <StatusPill status={inv.status} />
                </div>
                <p className="text-[14px] text-muted leading-relaxed max-w-[400px]">
                  You have been invited by <span className="font-bold text-foreground">{inv.inviter.name}</span> to attend this event.
                </p>
                <div className="text-[12px] text-muted font-medium tabular-nums">
                  {new Date(inv.event.date).toLocaleDateString()} · {inv.event.venue}
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {inv.status === "PENDING" ? (
                  <>
                    <Button variant="primary" onClick={() => handleRespond(inv.id, "ACCEPTED")}>Accept</Button>
                    <Button variant="ghost" onClick={() => handleRespond(inv.id, "DECLINED")}>Decline</Button>
                  </>
                ) : inv.status === "ACCEPTED" ? (
                  <Link href={`/events/${inv.event.id}`}>
                    <Button variant="secondary">View Event</Button>
                  </Link>
                ) : (
                  <span className="text-[13px] text-muted italic font-medium px-4">Invitation Declined</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
