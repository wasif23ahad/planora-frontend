"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { DashboardTopBar } from "@/components/layout/DashboardTopBar";

const sidebarItems = [
  { key: "overview", label: "Overview",   href: "/admin/overview", icon: "dashboard" },
  { key: "events",   label: "All Events", href: "/admin/events",   icon: "event" },
  { key: "users",    label: "All Users",  href: "/admin/users",    icon: "group" },
  { key: "reviews",  label: "Reviews",    href: "/admin/reviews",  icon: "reviews" },
  { key: "messages", label: "Messages",   href: "/admin/messages", icon: "mail" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const ALLOWED_ROLES = new Set(["ADMIN", "MANAGER"]);

  React.useEffect(() => {
    if (user && !ALLOWED_ROLES.has(user.role)) router.push("/dashboard");
  }, [user, router]);

  if (!user || !ALLOWED_ROLES.has(user.role)) return null;

  return (
    <div className="bg-background min-h-screen pt-[80px] font-sans pb-24">
      <div className="max-w-[1240px] mx-auto px-6">
        <DashboardTopBar />
        
        <div className="grid grid-cols-[240px_1fr] gap-10 items-start">
          {/* Sidebar */}
          <aside className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-4 sticky top-[104px] ambient-shadow">
            <div className="px-6 pt-2 pb-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-80">
              {user.role === "MANAGER" ? "Manager Panel" : "Admin Panel"}
            </div>
            <nav className="flex flex-col gap-1 px-2">
              {sidebarItems
                .filter(item => {
                  if (user.role === "MANAGER") {
                    return !["users", "messages"].includes(item.key);
                  }
                  return true;
                })
                .map(item => {
                  const isActive = pathname === item.href || (pathname === "/admin" && item.href === "/admin/overview");
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-[14px] transition-all rounded-xl
                        ${isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-secondary font-medium hover:bg-surface-container-low hover:text-on-surface"}`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-secondary/60'}`}
                            style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
            <div className="border-t border-outline-variant/10 mt-6 pt-4 px-2 flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-secondary hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-all">
                <span className="material-symbols-outlined text-[18px]">west</span>
                Back to site
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-secondary hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-all">
                <span className="material-symbols-outlined text-[18px]">person</span>
                User Dashboard
              </Link>
            </div>
          </aside>

          {/* Main */}
          <main className="animate-fade-in min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
