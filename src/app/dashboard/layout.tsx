"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

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
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-12 min-h-[calc(100vh-80px-200px)]">
      
      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <nav className="flex flex-col gap-1 sticky top-32">
          {navItems.map((item) => {
             // Check if active: exact match for root, or startsWith for subpages
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
                  {item.label === "My Events" && stats?.pendingRequestsCount > 0 && (
                    <span className="w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {stats.pendingRequestsCount}
                    </span>
                  )}
                </Link>
             );
          })}

          {/* Admin Panel Link */}
          {user?.role === "ADMIN" && (
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
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent text-secondary hover:bg-surface-container-low hover:text-error rounded-r-lg transition-colors mt-8 group"
          >
            <span className="material-symbols-outlined group-hover:text-error">logout</span>
            <span className="font-body">Log Out</span>
          </button>
        </nav>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <main className="flex-1 max-w-[1040px] min-w-0">
        {children}
      </main>
    </div>
  );
}
