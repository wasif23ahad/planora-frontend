"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function DashboardTopBar({ label = "Workspace" }: { label?: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest('[data-dash-profile]')) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-6 py-3 mb-8 ambient-shadow">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[24px]">
          {user.role === "ADMIN" ? "admin_panel_settings" : user.role === "MANAGER" ? "supervisor_account" : "dashboard"}
        </span>
        <span className="font-headline font-semibold text-on-surface tracking-tight text-lg">
          {user.role === "ADMIN" ? "Admin" : user.role === "MANAGER" ? "Manager" : "Your"} {label}
        </span>
      </div>
      <div className="relative" data-dash-profile>
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
          className="flex items-center gap-4 group"
        >
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[12px] font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{user.name}</span>
            <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">{user.role}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-[15px] border border-primary/20 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
            {user.name[0]}
          </div>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-3 w-64 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl py-2 z-50 animate-slide-up overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/10 bg-surface-container-low/30">
              <div className="text-sm font-bold text-on-surface">{user.name}</div>
              <div className="text-xs text-secondary truncate mt-0.5">{user.email}</div>
            </div>
            <div className="p-2">
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px] text-secondary">person</span> Profile Settings
              </Link>
              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <Link href="/admin/overview" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px] text-secondary">admin_panel_settings</span> Management Panel
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px] text-secondary">dashboard</span> User Dashboard
              </Link>
              <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px] text-secondary">arrow_back</span> Back to Site
              </Link>
            </div>
            <div className="h-px bg-outline-variant/10 my-1" />
            <div className="p-2">
              <button
                onClick={() => { logout(); router.push("/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 rounded-lg text-left transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span> Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
