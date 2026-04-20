"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/Pill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";

export default function EventManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const fetchManagementData = async () => {
      try {
        const [eventRes, partRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/events/${id}/participants`),
        ]);
        setEvent(eventRes.data);
        setParticipants(partRes.data);
      } catch (error) {
        console.error("Failed to load management data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagementData();
  }, [id]);

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      await api.patch(`/events/${id}/participants/${userId}`, { status });
      setParticipants(prev => prev.map(p => p.userId === userId ? { ...p, status } : p));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await api.post(`/events/${id}/invite`, { email: inviteEmail });
      alert("Invitation sent successfully!");
      setInviteEmail("");
    } catch (error: any) {
      alert(error.response?.data?.message || "User not found or already invited.");
    } finally {
      setInviting(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-muted animate-pulse">Loading management console...</div>;

  return (
    <div className="space-y-12">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[28px] font-bold text-foreground font-tight tracking-tight">{event?.title}</h1>
          <p className="text-muted text-[14px]">Administering attendees and invitations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push(`/dashboard/events/${id}/edit`)}>Edit Details</Button>
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── PARTICIPANTS LIST ────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <SectionTitle>Confirmed Participants</SectionTitle>
          <div className="bg-white border border-border-base rounded-2xl overflow-hidden shadow-sm">
            {participants.length === 0 ? (
              <div className="py-12 text-center text-muted text-[14px]">No one has joined this event yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/5 border-b border-border-base">
                    <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {participants.map((p) => (
                    <tr key={p.userId} className="hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground text-[14px]">{p.user.name}</div>
                        <div className="text-[12px] text-muted">{p.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {p.status === "PENDING" && (
                          <>
                            <Button variant="success" small onClick={() => handleUpdateStatus(p.userId, "APPROVED")}>Approve</Button>
                            <Button variant="danger" small onClick={() => handleUpdateStatus(p.userId, "REJECTED")}>Reject</Button>
                          </>
                        )}
                        {p.status === "APPROVED" && (
                          <Button variant="danger" small onClick={() => handleUpdateStatus(p.userId, "REJECTED")}>Remove</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── INVITATION FORM ──────────────────────────────── */}
        <div className="space-y-6">
          <SectionTitle>Invite Guests</SectionTitle>
          <div className="p-8 bg-white border border-border-base rounded-2xl shadow-sm space-y-6">
            <p className="text-[13px] text-muted leading-relaxed">
              Invite people to join your event by entering their registered email address.
            </p>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <Input
                label="Email Address"
                placeholder="user@example.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button variant="primary" className="w-full" disabled={inviting}>
                {inviting ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          </div>

          <div className="p-8 bg-accent/5 border border-accent/20 rounded-2xl">
            <h4 className="text-[14px] font-bold text-accent mb-2">Private Events</h4>
            <p className="text-[12px] text-accent/80 leading-relaxed italic">
              Invitations are essential for Private events. Only invited users can see the registration button.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
