"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const adminNav = [
  { label: "Admin Hub", href: "/admin", icon: "🛡️" },
  { label: "Manage Users", href: "/admin/users", icon: "👥" },
  { label: "Manage Events", href: "/admin/events", icon: "🌍" },
  { label: "Global Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Guard the entire admin section
  React.useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-muted/5">
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside className="w-[280px] border-r border-border-base bg-white hidden lg:flex flex-col shadow-sm">
        <div className="p-8 flex-grow space-y-6">
          <div className="px-4">
            <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Administration</h2>
            <div className="space-y-1">
              {adminNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                      isActive 
                        ? "bg-danger/5 text-danger font-bold" 
                        : "text-muted hover:bg-muted/5 hover:text-foreground"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="px-4 pt-8 border-t border-border-base">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-bold text-accent hover:bg-accent/5 transition-colors"
            >
              <span>←</span>
              Exit to Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1240px] mx-auto p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
