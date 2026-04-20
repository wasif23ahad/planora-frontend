"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { CategoryPill, StatusPill } from "@/components/ui/Pill";

export default function AdminHubPage() {
  const [section, setSection] = useState<"events" | "users">("events");
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, eventsRes, usersRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/events"),
          api.get("/admin/users"),
        ]);
        setStats(statsRes.data);
        setEvents(eventsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="py-24 text-center text-[14px] text-muted font-medium animate-pulse">Establishing Admin Connection…</div>;

  const sidebarItems = [
    { key: "events", label: "All Events" },
    { key: "users", label: "All Users" },
  ];

  return (
    <div className="bg-background min-h-screen pt-[60px] font-sans pb-20">
      <div className="max-w-[1040px] mx-auto px-8 py-12 grid grid-cols-[220px_1fr] gap-10 items-start">
        
        {/* ── ADMIN SIDEBAR ─────────────────────────────── */}
        <aside className="bg-white rounded-[12px] border border-border-base py-2 sticky top-[80px] shadow-sm">
          <div className="px-5 pt-4 pb-1 text-[12px] font-semibold text-accent uppercase tracking-[0.07em]">
            Admin Panel
          </div>
          {sidebarItems.map(item => (
            <div 
              key={item.key} 
              onClick={() => setSection(item.key as any)}
              className={`px-5 py-2.5 text-[14px] cursor-pointer transition-all border-l-[3px] 
                ${section === item.key 
                  ? "bg-[#F3F1FF] text-foreground font-semibold border-accent" 
                  : "text-muted font-normal border-transparent hover:text-foreground"
                }`}
            >
              {item.label}
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-border-base">
            <Link href="/dashboard" className="block px-5 py-2.5 text-[14px] text-muted hover:text-foreground">
              User Dashboard
            </Link>
            <Link href="/" className="block px-5 py-2.5 text-[14px] text-muted hover:text-foreground">
              ← Back to site
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <main className="animate-fade-in min-w-0">
          
          {section === "events" && (
            <div>
              <div className="mb-8 items-end">
                <h1 className="text-[28px] font-bold text-foreground font-tight tracking-[-0.02em] mb-1">All Events</h1>
                <div className="text-[14px] text-muted">{events.length} total events on platform</div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total events", value: events.length },
                  { label: "Featured", value: events.filter(e=>e.status==="featured").length },
                  { label: "Reported", value: events.filter(e=>e.reported).length || 0 },
                  { label: "Participants", value: events.reduce((a,e)=>a+(e.participantsCount||0), 0) },
                ].map((s, i) => (
                  <div key={i} className="bg-white px-5 py-4 rounded-[12px] border border-border-base shadow-sm">
                    <div className="text-[24px] font-bold text-foreground font-tight tabular-nums leading-none mb-1">{s.value}</div>
                    <div className="text-[12px] font-semibold text-muted uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[12px] border border-border-base overflow-hidden shadow-sm">
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
                      <tr key={ev.id} className="border-b border-border-base last:border-0 hover:bg-[#F9F9F7] transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-foreground truncate max-w-[180px]">{ev.title}</div>
                          {ev.reported && <div className="text-[10px] text-danger font-bold uppercase mt-1">⚑ Reported</div>}
                        </td>
                        <td className="px-4 py-4 text-muted">{ev.owner?.name || "Member"}</td>
                        <td className="px-4 py-4"><CategoryPill type={ev.visibility} feeCents={ev.feeCents} /></td>
                        <td className="px-4 py-4"><StatusPill status={ev.status} /></td>
                        <td className="px-4 py-4 text-muted tabular-nums">{ev.participantsCount || 0}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                             <button className={`text-[12px] px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer ${ev.status==='featured' ? 'bg-[#EDE9FF] border-accent text-accent' : 'bg-transparent border-border-base text-muted hover:text-foreground'}`}>
                               {ev.status === "featured" ? "★ Featured" : "☆ Feature"}
                             </button>
                             <Button variant="danger" small>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "users" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[28px] font-bold text-foreground font-tight tracking-[-0.02em] mb-1">All Users</h1>
                <div className="text-[14px] text-muted">{users.length} registered members</div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total users", value: users.length },
                  { label: "Active", value: users.filter(u=>u.role!=='BANNED').length },
                  { label: "Suspended", value: 0 },
                ].map((s, i) => (
                  <div key={i} className="bg-white px-5 py-4 rounded-[12px] border border-border-base shadow-sm">
                    <div className="text-[24px] font-bold text-foreground font-tight tabular-nums leading-none mb-1">{s.value}</div>
                    <div className="text-[12px] font-semibold text-muted uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[12px] border border-border-base overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-[14px]">
                  <thead>
                    <tr className="bg-background border-b border-border-base">
                      {["User", "Email", "Joined", "Events", "Status", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-[12px] font-semibold text-muted uppercase tracking-[0.05em]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-border-base last:border-0 hover:bg-[#F9F9F7] transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-border-base flex items-center justify-center font-bold text-[11px] text-muted">{u.name[0]}</div>
                            <div className="font-semibold text-foreground">{u.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-muted">{u.email}</td>
                        <td className="px-4 py-4 text-muted tabular-nums">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-muted tabular-nums">{u._count?.events || 0}</td>
                        <td className="px-4 py-4"><StatusPill status={u.role==='ADMIN'?'featured':'active'} /></td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                             <Button variant="secondary" small>Suspend</Button>
                             <Button variant="danger" small>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
