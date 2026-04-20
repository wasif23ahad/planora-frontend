"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/invitations/me")
      .then(({ data }) => setInvitations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id: string, isPaid: boolean, eventId: string) => {
    if (isPaid) {
      try {
        const { data } = await api.post("/payments/checkout", { eventId });
        window.location.href = data.url;
      } catch (err: any) {
        alert(err.response?.data?.error?.message || "Payment failed");
      }
    } else {
      try {
        await api.post(`/invitations/${id}/accept`);
        setInvitations(prev => prev.filter(inv => inv.id !== id));
      } catch (err: any) {
        alert(err.response?.data?.error?.message || "Failed to accept");
      }
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await api.post(`/invitations/${id}/decline`);
      setInvitations(prev => prev.filter(inv => inv.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to decline");
    }
  };

  if (loading) return <div className="py-12 text-[14px] text-muted">Loading…</div>;

  return (
    <div>
      <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] mb-8">Pending Invitations</h1>

      {invitations.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-base rounded-[12px] text-muted text-[14px]">
          No pending invitations.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {invitations.map(inv => (
            <div
              key={inv.id}
              className="bg-white rounded-[12px] border border-border-base px-6 py-5 flex justify-between items-center"
            >
              <div>
                <div className="text-[15px] font-semibold text-foreground mb-1">{inv.event?.title}</div>
                <div className="text-[13px] text-muted">
                  {inv.inviter?.name} · {inv.event?.date ? new Date(inv.event.date).toLocaleDateString() : ""}
                  {inv.event?.feeCents > 0 && (
                    <span className="ml-2 text-foreground font-medium">৳{(inv.event.feeCents / 100).toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {inv.event?.feeCents > 0 ? (
                  <Button variant="primary" small onClick={() => handleAccept(inv.id, true, inv.event.id)}>
                    Pay & Accept — ৳{(inv.event.feeCents / 100).toLocaleString()}
                  </Button>
                ) : (
                  <Button variant="primary" small onClick={() => handleAccept(inv.id, false, inv.event?.id)}>
                    Accept
                  </Button>
                )}
                <Button variant="secondary" small onClick={() => handleDecline(inv.id)}>Decline</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
