"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/Pill";

interface DashboardData {
  stats: {
    totalEvents: number;
    totalRevenue: number; // in cents
    totalParticipations: number;
  };
  ownedEvents: any[];
  participatingEvents: any[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch metrics and both event lists from the backend
        const [owned, participating] = await Promise.all([
          api.get("/events/owned"),
          api.get("/events/participating"),
        ]);
        
        // Calculate simple stats frontend-side for F10 (or use backend if available)
        const totalRev = owned.data.reduce((acc: number, ev: any) => acc + (ev.feeCents * ev._count?.participants || 0), 0);

        setData({
          stats: {
            totalEvents: owned.data.length,
            totalRevenue: totalRev,
            totalParticipations: participating.data.length,
          },
          ownedEvents: owned.data,
          participatingEvents: participating.data,
        });
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="animate-pulse py-12 text-center text-muted">Loading your workspace...</div>;

  return (
    <div className="space-y-12">
      {/* ── WELCOME ───────────────────────────────────────── */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-foreground font-tight tracking-tight">
            Hi, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-muted text-[15px]">Here's what's happening with your events.</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button variant="primary">Create Event</Button>
        </Link>
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "My Events", value: data?.stats.totalEvents, icon: "📅" },
          { label: "Total Revenue", value: `৳${((data?.stats.totalRevenue || 0) / 100).toLocaleString()}`, icon: "💰" },
          { label: "Joined", value: data?.stats.totalParticipations, icon: "🎟️" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-border-base rounded-2xl shadow-sm">
            <div className="text-[24px] mb-2">{stat.icon}</div>
            <div className="text-[24px] font-bold text-foreground tabular-nums">{stat.value}</div>
            <div className="text-[13px] font-medium text-muted uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── MY EVENTS ────────────────────────────────────── */}
      <section>
        <SectionTitle 
          action={
            <Link href="/dashboard/events" className="text-[13px] text-accent font-bold hover:underline">
              View all
            </Link>
          }
        >
          Recent Events Created
        </SectionTitle>

        <div className="bg-white border border-border-base rounded-2xl overflow-hidden shadow-sm">
          {data?.ownedEvents.length === 0 ? (
            <div className="py-12 px-8 text-center text-muted text-[14px]">You haven't created any events yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/5 border-b border-border-base">
                    <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Joiners</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {data?.ownedEvents.slice(0, 5).map((ev) => (
                    <tr key={ev.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground text-[14px] truncate max-w-[200px]">{ev.title}</div>
                        <div className="text-[12px] text-muted">{new Date(ev.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px]">
                        <StatusPill status={ev.status || "active"} />
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground text-[14px] tabular-nums">
                        {ev._count?.participants || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/events/${ev.id}`}>
                          <Button variant="secondary" small>Manage</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── PARTICIPATING ────────────────────────────────── */}
      <section>
        <SectionTitle>Events I'm Joining</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.participatingEvents.length === 0 ? (
            <div className="p-8 border border-dashed border-border-base rounded-2xl text-center text-muted col-span-full">
              You haven't joined any events yet.
            </div>
          ) : (
            data?.participatingEvents.slice(0, 4).map((ev) => (
              <div key={ev.id} className="p-5 bg-white border border-border-base rounded-2xl flex items-center gap-4 hover:border-accent transition-colors">
                <div className="w-12 h-12 bg-accent/5 rounded-xl flex items-center justify-center text-[20px]">🎟️</div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-foreground text-[14px] truncate">{ev.title}</div>
                  <div className="text-[12px] text-muted">{new Date(ev.date).toLocaleDateString()} · {ev.venue}</div>
                </div>
                <Link href={`/events/${ev.id}`}>
                  <Button variant="ghost" small>View</Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
