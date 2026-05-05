"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--warn)",
  "var(--secondary)",
  "var(--primary-container)",
  "var(--accent-container)",
  "var(--outline)",
];

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/charts"), api.get("/admin/stats")])
      .then(([chartsRes, statsRes]) => {
        setData(chartsRes.data);
        setStats(statsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-24 text-center text-secondary animate-pulse font-headline">
      Loading platform insights...
    </div>
  );

  const tooltipStyle = {
    background: "var(--surface-container-lowest)",
    border: "1px solid var(--outline-variant)",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--on-surface)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-headline text-4xl font-semibold tracking-tighter text-on-surface">Overview</h1>
        <p className="text-secondary mt-1">A live snapshot of activity across the platform.</p>
      </header>

      {/* Top stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total users",     value: stats?.totalUsers ?? 0,                              color: "text-on-surface", icon: "group" },
          { label: "Total events",    value: stats?.totalEvents ?? 0,                             color: "text-primary", icon: "event" },
          { label: "Revenue (BDT)",   value: `৳${((stats?.totalRevenue ?? 0) / 100).toLocaleString()}`, color: "text-accent", icon: "payments" },
          { label: "Categories",      value: data?.eventsByCategory?.length ?? 0,                 color: "text-warn", icon: "category" },
        ].map((c, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 ambient-shadow hover:border-outline-variant/50 transition-all flex flex-col h-full min-h-[140px]">
             <div className="flex items-center justify-between mb-auto">
              <span className={`material-symbols-outlined text-[28px] ${c.color}`}>{c.icon}</span>
            </div>
            <div className="mt-4">
              <div className={`font-headline font-bold text-3xl tabular-nums leading-none ${c.color}`}>{c.value}</div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-2 leading-relaxed">{c.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Bar + Line side by side */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 ambient-shadow">
          <h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Events by category</h3>
          <p className="text-secondary text-sm mb-6">Distribution of community gatherings.</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.eventsByCategory ?? []}>
                <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="category" stroke="var(--secondary)" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 600 }} />
                <YAxis stroke="var(--secondary)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} tick={{ fontWeight: 600 }} />
                <Tooltip cursor={{ fill: "var(--surface-container-low)", opacity: 0.4 }} contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 ambient-shadow">
          <h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Signups over time</h3>
          <p className="text-secondary text-sm mb-6">New user growth in the last 12 months.</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.signupsByMonth ?? []}>
                <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="label" stroke="var(--secondary)" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 600 }} />
                <YAxis stroke="var(--secondary)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} tick={{ fontWeight: 600 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--accent)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "var(--accent)", strokeWidth: 2, stroke: "var(--surface-container-lowest)" }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Pie full width */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 ambient-shadow">
        <h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Revenue by event</h3>
        <p className="text-secondary text-sm mb-6">Contribution of top 6 events to total platform revenue.</p>
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={(data?.revenueByEvent ?? []).map((r: any) => ({ name: r.title, value: r.amountCents / 100 }))}
                dataKey="value"
                nameKey="name"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={4}
                stroke="var(--surface-container-lowest)"
                strokeWidth={3}
                animationDuration={1500}
              >
                {(data?.revenueByEvent ?? []).map((_: any, i: number) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Revenue"]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(v) => <span className="text-[12px] font-bold text-secondary uppercase tracking-wider ml-1">{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
