"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "📊" },
  { label: "My Events", href: "/dashboard/events", icon: "📅" },
  { label: "Registrations", href: "/dashboard/registrations", icon: "🎟️" },
  { label: "Invitations", href: "/dashboard/invitations", icon: "💌" },
  { label: "Account Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-background">
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside className="w-[280px] border-r border-border-base bg-white hidden lg:flex flex-col">
        <div className="p-8 grow">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                    isActive 
                      ? "bg-accent/5 text-accent" 
                      : "text-muted hover:bg-muted/5 hover:text-foreground"
                  }`}
                >
                  <span className="text-[18px]">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {user?.role === "ADMIN" && (
            <div className="mt-10 pt-8 border-t border-border-base">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-bold text-danger hover:bg-danger/5 transition-colors"
              >
                <span>🛡️</span>
                Admin Panel
              </Link>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-border-base">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg text-[14px] font-medium text-muted hover:bg-red-50 hover:text-danger transition-colors"
          >
            <span>🚪</span>
            Log out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <main className="grow overflow-y-auto animate-fade-in p-10">
        <div className="max-w-[1000px] mx-auto p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
