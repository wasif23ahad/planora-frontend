"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { StatusPill, CategoryPill } from "@/components/ui/Pill";

interface DashboardData {
  stats: {
    totalEvents: number;
    totalRevenue: number;
    totalParticipations: number;
  };
  ownedEvents: any[];
  participatingEvents: any[];
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: owned } = await api.get("/events/me");

        setData({
          stats: {
            totalEvents: owned.length,
            totalRevenue: 0,
            totalParticipations: 0,
          },
          ownedEvents: owned,
          participatingEvents: [],
        });
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="animate-pulse py-12 text-[14px] text-muted font-medium">Loading session workspace…</div>;

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] font-tight mb-1">My Events</h1>
          <div className="text-[14px] text-muted">Welcome back, {user?.name.split(" ")[0]}. Manage your hosted gatherings.</div>
        </div>
        <Link href="/dashboard/events/new">
          <Button variant="primary">+ Create event</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Created events", value: data?.stats.totalEvents },
          { label: "Estimated revenue", value: `৳${((data?.stats.totalRevenue || 0)/100).toLocaleString()}` },
          { label: "Joined events", value: data?.stats.totalParticipations },
        ].map((s, i) => (
          <div key={i} className="bg-white px-5 py-5 rounded-[12px] border border-border-base shadow-sm">
            <div className="text-[24px] font-bold text-foreground font-tight tabular-nums mb-1">{s.value}</div>
            <div className="text-[12px] font-semibold text-muted uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[12px] border border-border-base overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-background border-b border-border-base">
              {["Event", "Date", "Status", "Participants", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-[12px] font-semibold text-muted uppercase tracking-[0.05em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data || data.ownedEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center text-muted">
                  <div className="text-[15px] mb-1">No events yet</div>
                  <div className="text-[13px]">Create your first event to get started.</div>
                </td>
              </tr>
            ) : (
              data.ownedEvents.map(ev => (
                <tr 
                  key={ev.id} 
                  className="border-b border-border-base last:border-0 hover:bg-[#F9F9F7] transition-colors group cursor-default"
                >
                  <td className="px-4 py-4 font-semibold text-foreground">{ev.title}</td>
                  <td className="px-4 py-4 text-muted tabular-nums">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4"><StatusPill status={ev.status || "active"} /></td>
                  <td className="px-4 py-4 text-muted tabular-nums">
                    {ev._count?.participants || 0}
                    {/* Add pending badge if any - simplified for now */}
                    {ev._count?.participants > 10 && <span className="ml-2 bg-[#FEF3C7] text-[#B4600E] text-[10px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/events/${ev.id}`}>
                        <Button variant="secondary" small>Manage</Button>
                      </Link>
                      <Button variant="ghost" small>Edit</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sub-section: Activity or similar */}
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-[18px] font-bold text-foreground font-tight mb-4 tracking-tight">Recent Activity</h2>
          <div className="space-y-3">
             <div className="p-4 bg-white border border-border-base rounded-[10px] text-[13px] text-muted leading-relaxed">
               No recent notifications for your hosted events yet.
             </div>
          </div>
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-foreground font-tight mb-4 tracking-tight">Pending Invitations</h2>
          <div className="p-5 bg-white border border-border-base rounded-[10px] text-center border-dashed text-muted text-[13px]">
             No pending invites for you.
          </div>
        </div>
      </div>

    </div>
  );
}
