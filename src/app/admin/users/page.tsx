"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/Pill";
import api from "@/lib/api";

export default function UserModerationPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/admin/users");
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  if (loading) return <div className="py-24 text-center text-muted animate-pulse">Scanning user records...</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <SectionTitle>User Moderation</SectionTitle>
          <p className="text-muted text-[14px] mt-1">Found {users.length} registered users.</p>
        </div>
      </div>

      <div className="bg-white border border-border-base rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-muted/5 border-b border-border-base">
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-[12px] font-bold text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-foreground text-[14px]">{u.name}</div>
                  <div className="text-[12px] text-muted">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-accent/10 text-accent" : "bg-muted/10 text-muted"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={u.isActive ? "APPROVED" : "REJECTED"} />
                </td>
                <td className="px-6 py-4 text-[13px] text-muted tabular-nums whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant={u.isActive ? "danger" : "success"} 
                    small 
                    onClick={() => handleToggleStatus(u.id, u.isActive)}
                  >
                    {u.isActive ? "Deactivate" : "Reactivate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
