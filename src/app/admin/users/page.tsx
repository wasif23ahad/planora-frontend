"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/Pill";
import api from "@/lib/api";

export default function UserModerationPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users")
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !isActive });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !isActive } : u));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Internal user update failure");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to delete user");
    }
  };

  if (loading) return <div className="py-24 text-center text-secondary animate-pulse font-headline">Loading user manifest...</div>;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Community Members</h1>
        <p className="text-secondary mt-1">Review registrations and manage administrative access.</p>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Accounts", value: users.length, color: "text-on-surface", bg: "bg-surface-container" },
          { label: "Active Members", value: users.filter(u => u.isActive).length, color: "text-success", bg: "bg-success/5" },
          { label: "Suspended", value: users.filter(u => !u.isActive).length, color: "text-error", bg: "bg-error/5" },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border border-outline-variant/10 p-6 flex flex-col gap-2 ambient-shadow ${s.bg}`}>
            <div className={`text-3xl font-headline font-bold tabular-nums ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden ambient-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              <tr>
                <th className="px-8 py-5">Identified Member</th>
                <th className="px-8 py-5">Email Address</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5 text-center">Authorization</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center text-sm font-bold shadow-sm">
                        {u.name[0]}
                      </div>
                      <span className="font-headline font-bold text-on-surface text-base">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-on-surface-variant">{u.email}</td>
                  <td className="px-8 py-6 text-secondary tabular-nums font-medium">
                     {new Date(u.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest
                      ${u.role === "ADMIN" ? "bg-accent/10 text-accent border border-accent/20" : "bg-surface-container text-secondary"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <StatusPill status={u.isActive ? "active" : "suspended"} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant={u.isActive ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleToggle(u.id, u.isActive)}
                        className={u.isActive ? "text-error border-error/20 hover:bg-error/5" : ""}
                        icon={u.isActive ? "block" : "verified_user"}
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(u.id, u.name)}
                        className="text-error border-error/20 hover:bg-error/10"
                        icon="delete"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
