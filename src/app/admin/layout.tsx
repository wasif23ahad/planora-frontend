"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
  { key: "events", label: "All Events", href: "/admin/events" },
  { key: "users",  label: "All Users",  href: "/admin/users" },
  { key: "messages", label: "Messages",  href: "/admin/messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user && user.role !== "ADMIN") router.push("/dashboard");
  }, [user, router]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="bg-background min-h-screen pt-[60px] font-sans">
      <div className="max-w-[1040px] mx-auto px-8 py-12 grid grid-cols-[220px_1fr] gap-10 items-start">

        {/* Sidebar */}
        <aside className="bg-white rounded-[12px] border border-border-base py-2 sticky top-[80px]">
          <div className="px-5 pt-4 pb-1.5 text-[12px] font-semibold text-accent uppercase tracking-[0.07em]">
            Admin Panel
          </div>
          {sidebarItems.map(item => {
            const isActive = pathname === item.href || (pathname === "/admin" && item.href === "/admin/events");
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`block px-5 py-2.5 text-[14px] transition-all border-l-[3px]
                  ${isActive
                    ? "bg-[#F3F1FF] text-foreground font-semibold border-accent"
                    : "text-muted font-normal border-transparent hover:text-foreground"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-border-base mt-2">
            <Link href="/" className="block px-5 py-2.5 text-[14px] text-muted hover:text-foreground">
              ← Back to site
            </Link>
            <Link href="/dashboard" className="block px-5 py-2.5 text-[14px] text-muted hover:text-foreground">
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
  );
}
