import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import planoraApi from "../../lib/api";
const api = planoraApi;
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/Pill";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [ownedEvents, setOwnedEvents] = useState<any[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"hosting" | "attending">("attending");

  const stats = useMemo(() => {
    const now = new Date();
    const upcomingHosting = ownedEvents.filter(e => new Date(e.date) >= now).length;
    const totalParticipants = ownedEvents.reduce((sum, e) => sum + (e._count?.participations ?? 0), 0);
    const approvedJoins = joinedEvents.filter((p: any) => p.status === "APPROVED").length;
    const pendingJoins = joinedEvents.filter((p: any) => p.status === "PENDING").length;
    return { upcomingHosting, totalParticipants, approvedJoins, pendingJoins };
  }, [ownedEvents, joinedEvents]);

  const pieData = useMemo(() => [
    { name: "Approved", value: joinedEvents.filter((p: any) => p.status === "APPROVED").length, color: "var(--primary)" },
    { name: "Pending",  value: joinedEvents.filter((p: any) => p.status === "PENDING").length,  color: "#f59e0b" }, // Using a nice amber for pending
    { name: "Rejected", value: joinedEvents.filter((p: any) => p.status === "REJECTED").length, color: "var(--error)" },
  ].filter(d => d.value > 0), [joinedEvents]);

  const handlePay = async (eventId: string) => {
    if (!user?.phoneNumber || !user?.name) {
      router.push(`/events/${eventId}/checkout`);
      return;
    }
    try {
      const { data } = await api.post("/payments/checkout", { 
        eventId, 
        phoneNumber: user.phoneNumber 
      });
      window.location.href = data.url;
    } catch (err: any) {
      alert(err.response?.data?.message || "Payment service unavailable");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ownedRes, joinedRes] = await Promise.all([
          api.get("/events/me"),
          api.get("/events/joined"),
        ]);
        setOwnedEvents(ownedRes.data || []);
        setJoinedEvents(joinedRes.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="py-24 text-center text-secondary animate-pulse font-headline">
       Loading your dashboard...
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-headline font-semibold text-4xl tracking-tighter text-on-surface">
            Dashboard
          </h1>
          <p className="font-body text-secondary mt-2">
            Manage your community presence and event participation.
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <button className="bg-primary text-on-primary font-label font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Create event
          </button>
        </Link>
      </header>

      {/* Overview cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Hosting (upcoming)", value: stats.upcomingHosting, icon: "event_available", color: "text-primary" },
          { label: "Participants reached", value: stats.totalParticipants, icon: "group", color: "text-accent" },
          { label: "Approved tickets", value: stats.approvedJoins, icon: "confirmation_number", color: "text-primary" },
          { label: "Pending requests", value: stats.pendingJoins, icon: "schedule", color: "text-warn" },
        ].map((c, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 ambient-shadow hover:border-outline-variant/50 transition-all flex flex-col h-full min-h-[140px]">
            <div className="flex items-center justify-between mb-auto">
              <span className={`material-symbols-outlined text-[28px] ${c.color}`}>{c.icon}</span>
            </div>
            <div className="mt-4">
              <div className="font-headline font-bold text-3xl tabular-nums text-on-surface leading-none">{c.value}</div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-2 leading-relaxed min-h-[20px]">{c.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Pie chart */}
      {pieData.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 ambient-shadow">
            <h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Your participation status</h3>
            <p className="text-secondary text-sm mb-6">A breakdown of the events you've requested to join.</p>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    stroke="var(--surface-container-lowest)"
                    strokeWidth={2}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface-container-lowest)",
                      border: "1px solid var(--outline-variant)",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--on-surface)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    itemStyle={{ color: "var(--on-surface)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(v) => <span className="text-[12px] font-bold text-secondary uppercase tracking-wider ml-1">{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 ambient-shadow flex flex-col h-full">
            <h3 className="font-headline font-semibold text-lg text-on-surface">At a glance</h3>
            <ul className="space-y-4 text-sm mt-2">
              <li className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                <span className="text-secondary font-medium">Total events joined</span>
                <span className="font-headline font-bold text-on-surface tabular-nums text-lg">{joinedEvents.length}</span>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                <span className="text-secondary font-medium">Events you host</span>
                <span className="font-headline font-bold text-on-surface tabular-nums text-lg">{ownedEvents.length}</span>
              </li>
              <li className="flex items-center justify-between py-2">
                <span className="text-secondary font-medium">Featured events you own</span>
                <span className="font-headline font-bold text-accent tabular-nums text-lg">{ownedEvents.filter(e => e.isFeatured).length}</span>
              </li>
            </ul>
            <div className="mt-auto pt-6 border-t border-outline-variant/10">
               <p className="text-[11px] text-secondary leading-relaxed italic">
                 Your engagement helps grow the Planora community. Keep exploring!
               </p>
            </div>
          </div>
        </section>
      )}

      <div className="pt-4">
        <h2 className="font-headline text-2xl font-semibold tracking-tighter text-on-surface">
          Your events
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/20">
        <button 
          onClick={() => setActiveTab("attending")}
          className={`pb-4 font-headline font-semibold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === "attending" ? "text-primary border-primary" : "text-secondary border-transparent hover:text-on-surface"}`}
        >
          Attending ({joinedEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab("hosting")}
          className={`pb-4 font-headline font-semibold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === "hosting" ? "text-primary border-primary" : "text-secondary border-transparent hover:text-on-surface"}`}
        >
          Hosting ({ownedEvents.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "hosting" ? (
            <table className="w-full text-left font-body text-sm border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr>
                  <th className="px-6 py-4 font-semibold text-on-surface">Title</th>
                  <th className="px-6 py-4 font-semibold text-on-surface">Date</th>
                  <th className="px-6 py-4 font-semibold text-on-surface">Status</th>
                  <th className="px-6 py-4 font-semibold text-on-surface text-right">Participants</th>
                  <th className="px-6 py-4 font-semibold text-on-surface text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {ownedEvents.length > 0 ? (
                  ownedEvents.map((e) => (
                    <tr key={e.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-on-surface">{e.title}</div>
                          {e.pendingRequestsCount > 0 && (
                            <span className="w-2 h-2 bg-error rounded-full animate-pulse shadow-[0_0_8px_rgba(186,26,26,0.5)]"></span>
                          )}
                        </div>
                        <div className="text-secondary text-xs mt-1">{e.venue}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-headline font-semibold text-on-surface">
                          {new Date(e.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-secondary text-xs mt-1">{e.time || "TBA"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusPill status={e.isFeatured ? "featured" : "approved"} />
                      </td>
                      <td className="px-6 py-5 text-right font-headline font-semibold text-on-surface">
                         {e._count?.participations || 0}/{e.maxParticipants || '∞'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => router.push(`/dashboard/events/${e.id}/edit`)}
                            className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            Edit
                          </button>
                          <button 
                            onClick={() => router.push(`/dashboard/events/${e.id}`)}
                            className="relative text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium ml-4"
                          >
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Manage
                            {e.pendingRequestsCount > 0 && (
                              <span className="absolute -top-2 -right-2 bg-error text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {e.pendingRequestsCount}
                              </span>
                            )}
                          </button>
                        </div>
                        {e.pendingRequestsCount > 0 && (
                          <div className="opacity-100 lg:group-hover:opacity-0 transition-opacity mt-1">
                             <span className="text-[10px] text-error font-bold uppercase tracking-wider">
                               {e.pendingRequestsCount} New Request{e.pendingRequestsCount > 1 ? 's' : ''}
                             </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-secondary">
                      <div className="flex flex-col items-center gap-4">
                         <span className="material-symbols-outlined text-[48px] opacity-20">event_note</span>
                         <p>You haven't created any events yet.</p>
                         <Link href="/dashboard/events/new">
                            <Button variant="outline" size="sm">Start Hosting</Button>
                         </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left font-body text-sm border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr>
                  <th className="px-6 py-4 font-semibold text-on-surface">Event</th>
                  <th className="px-6 py-4 font-semibold text-on-surface">Date</th>
                  <th className="px-6 py-4 font-semibold text-on-surface">Organizer</th>
                  <th className="px-6 py-4 font-semibold text-on-surface">Your Status</th>
                  <th className="px-6 py-4 font-semibold text-on-surface text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {joinedEvents.length > 0 ? (
                  joinedEvents.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-medium text-on-surface">{p.event.title}</div>
                        <div className="text-secondary text-xs mt-1">{p.event.venue}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-headline font-semibold text-on-surface">
                          {new Date(p.event.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-on-surface font-medium">{p.event.owner?.name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        {p.status === 'APPROVED' ? (
                          <Link href={`/dashboard/tickets/${p.id}`}>
                            <button className="text-primary hover:underline font-semibold text-xs uppercase tracking-wider">
                              View Ticket
                            </button>
                          </Link>
                        ) : p.event.visibility === 'PRIVATE' && (p.event.feeCents > 0 || (p.event.fee || 0) > 0) && p.invitationStatus === 'ACCEPTED' ? (
                          <button 
                            onClick={() => handlePay(p.eventId)}
                            className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-opacity"
                          >
                            Pay & Join
                          </button>
                        ) : (
                          <span className="text-secondary text-xs uppercase tracking-wider">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-secondary">
                      <div className="flex flex-col items-center gap-4">
                         <span className="material-symbols-outlined text-[48px] opacity-20">rocket_launch</span>
                         <p>You haven't joined any events yet.</p>
                         <Link href="/events">
                            <Button variant="outline" size="sm">Explore Events</Button>
                         </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}