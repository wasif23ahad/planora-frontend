"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    api.get("/invitations/me")
      .then(({ data }) => setInvitations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id: string, isPaid: boolean, eventId: string) => {
    try {
      // First, accept the invitation in the backend
      await api.patch(`/invitations/${id}`, { status: "ACCEPTED" });
      
      // Update local state immediately so UI shows "ACCEPTED"
      setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "ACCEPTED" } : inv));
      
      if (isPaid) {
        // If user profile is incomplete, redirect to checkout info page
        if (!user?.phoneNumber || !user?.name) {
          router.push(`/events/${eventId}/checkout`);
          return;
        }
        
        const { data } = await api.post("/payments/checkout", { 
          eventId, 
          phoneNumber: user.phoneNumber 
        });
        window.location.href = data.url;
      } else {
        alert("Success! You've joined the event.");
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || "Action failed");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await api.patch(`/invitations/${id}`, { status: "DECLINED" });
      setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "DECLINED" } : inv));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to decline invitation");
    }
  };

  if (loading) return <div className="py-24 text-center text-secondary animate-pulse font-headline">Loading invitations...</div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Invitations</h1>
        <p className="text-secondary mt-1">Exclusive access requests and community invites.</p>
      </header>

      {invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-[64px] text-secondary/20">mail_outline</span>
          <p className="text-sm font-medium text-secondary">No pending invitations at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {invitations.map(inv => {
            const isPaid = (inv.event?.feeCents ?? inv.event?.fee ?? 0) > 0;
            const feeDisplay = inv.event?.feeCents ? inv.event.feeCents / 100 : (inv.event?.fee ?? 0);
            return (
              <div
                key={inv.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ambient-shadow"
              >
                <div className="space-y-1">
                  <h3 className="font-headline font-bold text-on-surface text-lg leading-tight">
                     {inv.event?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-secondary text-xs font-medium">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>Invite from {inv.sender?.name}</span>
                    <span className="opacity-30">·</span>
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span>{inv.event?.date ? new Date(inv.event.date).toLocaleDateString() : "TBA"}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  {inv.status === 'PENDING' ? (
                    <>
                      <Button 
                        variant={isPaid ? "primary" : "secondary"}
                        size="sm" 
                        onClick={() => handleAccept(inv.id, isPaid, inv.event?.id)}
                        className="flex-1 sm:flex-none"
                      >
                        {isPaid ? `Pay & Accept (\u09f3${feeDisplay.toLocaleString()})` : "Accept"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDecline(inv.id)}
                        className="border border-outline-variant/20"
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${
                      inv.status === 'ACCEPTED' 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-error/10 text-error border border-error/20'
                    }`}>
                      {inv.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
