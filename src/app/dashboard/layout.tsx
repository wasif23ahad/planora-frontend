"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

import { DashboardTopBar } from "@/components/layout/DashboardTopBar";

const navItems = [
  { label: "My Events", href: "/dashboard", icon: "event" },
  { label: "Invitations", href: "/dashboard/invitations", icon: "mail" },
  { label: "Reviews", href: "/dashboard/reviews", icon: "reviews" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { stats } = useNotifications();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <DashboardTopBar />
      
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 min-h-[calc(100vh-80px-200px)]">
      
      {/* ── SIDEBAR / MOBILE NAV ─────────────────────────── */}
      <aside className="w-full md:w-64 shrink-0">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col gap-1 sticky top-32">
          {navItems.map((item) => {
             const isActive = item.href === "/dashboard" 
               ? pathname === "/dashboard" 
               : pathname.startsWith(item.href);

             return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 border-l-4 rounded-r-lg font-body transition-colors
                    ${isActive
                      ? "border-primary bg-surface-container-low text-on-surface font-medium"
                      : "border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${isActive ? 'text-primary' : ''}`} 
                          style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                       {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.label === "Invitations" && stats?.pendingInvitationsCount > 0 && (
                    <span className="w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
                      {stats.pendingInvitationsCount}
                    </span>
                  )}
                  {item.label === "My Events" && (stats?.pendingRequestsCount ?? 0) > 0 && (
                    <span className="w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {stats.pendingRequestsCount}
                    </span>
                  )}
                </Link>
             );
          })}

          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <Link
              href="/admin/events"
              className={`flex items-center gap-3 px-4 py-3 border-l-4 rounded-r-lg font-body transition-colors mt-4
                ${pathname.startsWith("/admin")
                  ? "border-primary bg-surface-container-low text-on-surface font-medium"
                  : "border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface"
                }`}
            >
              <span className={`material-symbols-outlined ${pathname.startsWith("/admin") ? 'text-primary' : ''}`}>
                 admin_panel_settings
              </span>
              <span>{user.role === "MANAGER" ? "Manager Panel" : "Admin Panel"}</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent text-secondary hover:bg-surface-container-low hover:text-error rounded-r-lg transition-colors mt-8 group"
          >
            <span className="material-symbols-outlined group-hover:text-error">logout</span>
            <span className="font-body">Log Out</span>
          </button>
        </nav>

        {/* Mobile Nav (Horizontal Chips) */}
        <nav className="md:hidden flex items-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar">
          {navItems.map((item) => {
             const isActive = item.href === "/dashboard" 
               ? pathname === "/dashboard" 
               : pathname.startsWith(item.href);

             return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium border transition-all
                    ${isActive
                      ? "bg-primary border-primary text-on-primary shadow-md"
                      : "bg-surface border-outline-variant text-secondary"
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                     {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
             );
          })}
          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <Link
              href="/admin/events"
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium border transition-all
                ${pathname.startsWith("/admin")
                  ? "bg-primary border-primary text-on-primary shadow-md"
                  : "bg-surface border-outline-variant text-secondary"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span>Admin</span>
            </Link>
          )}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <main className="flex-1 max-w-[1040px] min-w-0">
        {children}
      </main>
      </div>
    </div>
  );
}
