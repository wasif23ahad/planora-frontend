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
      alert(err.response?.data?.error?.message || "Failed to update user");
    }
  };

  if (loading) return <div className="py-24 text-center text-muted animate-pulse">Loading users…</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] mb-1">All Users</h1>
        <div className="text-[14px] text-muted">{users.length} registered users</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total users",  value: users.length },
          { label: "Active",       value: users.filter(u => u.isActive).length },
          { label: "Deactivated",  value: users.filter(u => !u.isActive).length },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[12px] border border-border-base p-5">
            <div className="text-[24px] font-bold text-foreground tabular-nums">{s.value}</div>
            <div className="text-[13px] text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[12px] border border-border-base overflow-hidden">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-background border-b border-border-base">
              {["User", "Email", "Joined", "Role", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-[12px] font-semibold text-muted uppercase tracking-[0.05em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border-base hover:bg-[#F9F9F7] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-border-base flex items-center justify-center text-[12px] font-semibold text-muted shrink-0">
                      {u.name[0]}
                    </div>
                    <span className="font-medium text-foreground">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3 text-muted tabular-nums">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-[#EDE9FF] text-accent" : "bg-border-base text-muted"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={u.isActive ? "active" : "suspended"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant={u.isActive ? "danger" : "secondary"}
                      small
                      onClick={() => handleToggle(u.id, u.isActive)}
                    >
                      {u.isActive ? "Suspend" : "Reactivate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
