"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/Pill";
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
  const [activeTab, setActiveTab] = useState("participants");

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
       alert("Failed to update participant status.");
    }
  };

  const handleApproveRequest = async (userId: string, email: string) => {
    if (event?.visibility === "PRIVATE") {
      try {
        await api.post(`/events/${id}/invite`, { email });
        // Since it's an invite, let's remove them from the pending participants list or mark them as invited.
        // The easiest is to just reject/remove the PENDING participation so it doesn't clutter,
        // OR we can just leave it PENDING until they accept. Let's leave it PENDING but alert success.
        alert(`Invitation sent to ${email}! They must accept it from their dashboard.`);
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to send invitation.");
      }
    } else {
      handleUpdateStatus(userId, "APPROVED");
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
      alert(error.response?.data?.message || "Internal invitation failure.");
    } finally {
      setInviting(false);
    }
  };

  if (loading) return (
    <div className="py-24 text-center text-secondary animate-pulse font-headline">
      Initialising control modules...
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-sm text-secondary mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3 font-medium">
          <li className="inline-flex items-center">
            <Link href="/dashboard" className="inline-flex items-center hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Events</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-on-surface truncate max-w-[150px] md:max-w-none">{event?.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-on-surface mb-2">
            {event?.title}
          </h1>
          <p className="text-secondary text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            {new Date(event?.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
            <span className="opacity-30">·</span>
            {event?.time || "TBA"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/dashboard/events/${id}/edit`)}
            className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Event
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-surface-container-high">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8 overflow-x-auto hide-scrollbar">
          {[
            { key: "details", label: "Details" },
            { key: "participants", label: "Participants" },
            { key: "invitations", label: "Invitations" },
            { key: "analytics", label: "Analytics" }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === t.key 
                  ? "border-primary text-primary" 
                  : "border-transparent text-secondary hover:text-on-surface hover:border-surface-container-high"}`}
            >
              {t.label}
              {t.key === 'participants' && (
                 <span className="ml-2 text-[10px] bg-surface-container px-1.5 py-0.5 rounded font-bold opacity-60">
                   {participants.length}
                 </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <section className="animate-fade-in">
        {activeTab === "participants" && (
           <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-secondary text-[20px]">search</span>
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant/20 rounded-lg bg-surface-container-lowest text-on-surface placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm"
                    placeholder="Search participants..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-[0_4px_24px_rgba(26,28,27,0.04)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-surface-container-high text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-container-low/50">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-on-surface">Member</th>
                        <th className="px-6 py-4 font-semibold text-on-surface text-center">Status</th>
                        <th className="px-6 py-4 font-semibold text-on-surface">Join Date</th>
                        <th className="px-6 py-4 font-semibold text-on-surface text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/50 bg-surface-container-lowest">
                      {participants.length > 0 ? (
                        participants.map((p) => (
                          <tr key={p.userId} className="hover:bg-surface-container-low/30 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="font-medium text-on-surface">{p.user.name}</div>
                               <div className="text-secondary text-xs">{p.user.email}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <StatusPill status={p.status} />
                            </td>
                            <td className="px-6 py-4 text-secondary">
                               {new Date(p.joinedAt || Date.now()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                {p.status === "PENDING" && (
                                   <>
                                      <button 
                                        onClick={() => handleApproveRequest(p.userId, p.user.email)}
                                        className="text-primary hover:opacity-80 transition-opacity font-medium text-xs border border-primary/20 rounded px-2 py-1"
                                      >
                                        {event?.visibility === "PRIVATE" ? "Send Invite" : "Approve"}
                                      </button>
                                      <button 
                                        onClick={() => handleUpdateStatus(p.userId, "REJECTED")}
                                        className="text-error hover:opacity-80 transition-opacity font-medium text-xs border border-error/20 rounded px-2 py-1 ml-1"
                                      >
                                        Reject
                                      </button>
                                   </>
                                )}
                                {p.status === "APPROVED" && (
                                   <button 
                                     onClick={() => handleUpdateStatus(p.userId, "BANNED")}
                                     className="text-secondary hover:text-error transition-colors p-1"
                                     title="Ban Member"
                                   >
                                     <span className="material-symbols-outlined text-[20px]">block</span>
                                   </button>
                                )}
                                <button className="text-secondary hover:text-on-surface transition-colors p-1" title="More Options">
                                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-secondary">
                             No participants registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        )}

        {/* Other tabs remain largely the same in logic but styled consistently */}
        {activeTab === "invitations" && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-10 ambient-shadow space-y-6">
                 <div className="space-y-2">
                    <h3 className="font-headline text-2xl font-semibold text-on-surface">Direct Invitations</h3>
                    <p className="text-sm text-secondary leading-relaxed">
                       Grant exclusive access to specific individuals via email.
                    </p>
                 </div>
                 <form onSubmit={handleSendInvite} className="space-y-6">
                    <Input
                       label="Guest Email"
                       placeholder="guest@example.com"
                       type="email"
                       value={inviteEmail}
                       onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <button className="w-full bg-primary text-on-primary font-body font-medium text-sm py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-[20px]">send</span>
                       {inviting ? "Sending..." : "Send Invitation"}
                    </button>
                 </form>
              </div>
           </div>
        )}

        {(activeTab === "details" || activeTab === "analytics") && (
          <div className="py-20 text-center space-y-4">
             <span className="material-symbols-outlined text-[48px] text-secondary/20">construction</span>
             <p className="text-secondary font-medium tracking-tight">This module is currently being refined for the new design system.</p>
          </div>
        )}
      </section>
    </div>
  );
}
