"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "My Events", href: "/dashboard" },
  { label: "Pending Invitations", href: "/dashboard/invitations" },
  { label: "My Reviews", href: "/dashboard/reviews" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="bg-background min-h-screen pt-[60px] font-sans">
      <div className="max-w-[1040px] mx-auto px-8 py-12 grid grid-cols-[220px_1fr] gap-10 items-start">

        {/* ── SIDEBAR ──────────────────────────────────────── */}
        <aside className="bg-white rounded-[12px] border border-border-base py-2 sticky top-[80px]">
          <div className="px-5 pt-4 pb-3 text-[12px] font-semibold text-muted uppercase tracking-[0.07em]">
            Dashboard
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-5 py-2.5 text-[14px] transition-all border-l-[3px]
                  ${isActive
                    ? "bg-[#F3F1FF] text-foreground font-semibold border-accent"
                    : "text-muted font-normal border-transparent hover:text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-border-base mt-2">
            <Link href="/" className="block px-5 py-2.5 text-[14px] text-muted hover:text-foreground">
              ← Back to site
            </Link>
            {user?.role === "ADMIN" && (
              <Link href="/admin/events" className="block px-5 py-2.5 text-[14px] text-muted hover:text-foreground">
                Admin panel
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="block w-full text-left px-5 py-2.5 text-[14px] text-muted hover:text-foreground cursor-pointer"
            >
              Log out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
