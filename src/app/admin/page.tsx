"use client";

import React, { useState, useEffect } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import api from "@/lib/api";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-24 text-center text-muted animate-pulse">Loading command center...</div>;

  const metricCards = [
    { label: "Platform Users", value: stats.totalUsers, icon: "👥", trend: "Active Community" },
    { label: "Total Events", value: stats.totalEvents, icon: "🌍", trend: "Global Reach" },
    { label: "Total Revenue", value: `৳${(stats.totalRevenue / 100).toLocaleString()}`, icon: "💰", trend: "Lifetime Processing" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[32px] font-bold text-foreground font-tight tracking-tight">Admin Hub</h1>
        <p className="text-muted text-[14px]">Real-time platform overview and master controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metricCards.map((card) => (
          <div key={card.label} className="bg-white border border-border-base p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[24px]">{card.icon}</span>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 rounded-md">{card.trend}</span>
            </div>
            <div>
              <div className="text-[32px] font-bold text-foreground font-tight leading-none">{card.value}</div>
              <div className="text-[13px] font-bold text-muted uppercase tracking-wider mt-2">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <div className="p-10 bg-white border border-border-base rounded-3xl shadow-sm space-y-4">
          <SectionTitle>System Integrity</SectionTitle>
          <p className="text-[14px] text-muted leading-relaxed">
            All moderation actions taken in the Admin Hub are logged. Deleting an event is permanent and will trigger automatic refunds for paid participants via Stripe where applicable.
          </p>
        </div>
        <div className="p-10 bg-danger/5 border border-danger/10 rounded-3xl space-y-4">
          <SectionTitle>Security Warning</SectionTitle>
          <p className="text-[14px] text-danger/80 leading-relaxed italic">
            You are currently in Super Admin mode. You have the authority to deactivate any user or remove any content across the platform. Proceed with caution.
          </p>
        </div>
      </div>
    </div>
  );
}
