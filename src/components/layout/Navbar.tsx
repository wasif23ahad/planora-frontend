"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotifications";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { stats: notifications, dismissUpcomingEvent, markAsRead } = useNotifications();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Removed isAuthPage check to allow Navbar on all pages as requested

  return (
    <nav 
      className={`sticky top-0 z-50 bg-surface w-full transition-all duration-200 border-b
        ${scrolled ? "border-outline-variant shadow-sm" : "border-transparent"}`}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="text-2xl font-semibold tracking-tighter text-on-surface font-headline hover:opacity-80 transition-opacity">
            Planora
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-headline font-semibold tracking-tighter uppercase text-sm transition-all duration-150
                    ${isActive 
                      ? "text-primary border-b-2 border-primary pb-1" 
                      : "text-secondary hover:text-on-surface hover:opacity-80"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-low transition-colors relative">
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                  {notifications?.totalCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {notifications.totalCount}
                    </span>
                  )}
                </button>
                
                {/* Dropdown Popover */}
                <div className="absolute right-0 top-full pt-2 w-80 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50
                  before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
                  <div className="bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl p-6">
                    <h4 className="font-headline font-bold text-on-surface mb-4">Notifications</h4>
                   <div className="space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar">
                      {notifications?.pendingInvitationsCount > 0 && (
                        <Link href="/dashboard/invitations" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/10">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-sm">mail</span>
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-on-surface">New Invitations</p>
                              <p className="text-[10px] text-secondary truncate">You have {notifications.pendingInvitationsCount} pending invites.</p>
                           </div>
                        </Link>
                      )}
                      {notifications?.pendingRequestsCount > 0 && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/30 border border-outline-variant/10">
                           <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-sm">group</span>
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-on-surface">Pending Requests</p>
                              <p className="text-[10px] text-secondary truncate">Check your event management dashboard.</p>
                           </div>
                        </div>
                      )}
                      {notifications?.upcomingAttending?.length > 0 ? (
                        notifications.upcomingAttending.map((ev: any) => (
                          <div key={ev.id} className="group/item relative">
                            <Link 
                              href={`/events/${ev.id}`} 
                              onClick={() => dismissUpcomingEvent(ev.id)}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/10"
                            >
                               <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-sm">event</span>
                               </div>
                               <div className="min-w-0">
                                  <p className="text-xs font-bold text-on-surface">{ev.title}</p>
                                  <p className="text-[10px] text-secondary">Starting {new Date(ev.date).toLocaleDateString()}</p>
                               </div>
                            </Link>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dismissUpcomingEvent(ev.id);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-surface-container-high opacity-0 group-hover/item:opacity-100 flex items-center justify-center text-secondary hover:text-on-surface transition-all"
                            >
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </div>
                        ))
                      ) : null}

                      {notifications?.notifications?.map((n: any) => (
                        <div key={n.id} className="group/item relative">
                          <Link 
                            href={n.link || "#"} 
                            onClick={() => markAsRead(n.id)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/10"
                          >
                             <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-sm">info</span>
                             </div>
                             <div className="min-w-0">
                                <p className="text-xs font-bold text-on-surface">{n.message}</p>
                                <p className="text-[10px] text-secondary">{new Date(n.createdAt).toLocaleDateString()}</p>
                             </div>
                          </Link>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-surface-container-high opacity-0 group-hover/item:opacity-100 flex items-center justify-center text-secondary hover:text-on-surface transition-all"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </div>
                      ))}
                      
                      {notifications?.totalCount === 0 && (
                        <div className="py-8 text-center space-y-2">
                           <span className="material-symbols-outlined text-secondary/20 text-4xl">notifications_off</span>
                           <p className="text-xs text-secondary">All caught up!</p>
                        </div>
                      )}
                   </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <Link 
                  href="/dashboard" 
                  className={`font-headline font-semibold tracking-tighter uppercase text-sm transition-all duration-150 hidden sm:block
                    ${pathname.startsWith("/dashboard") 
                      ? "text-primary border-b-2 border-primary pb-1" 
                      : "text-secondary hover:text-on-surface hover:opacity-80"}`}
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
                   <div className="hidden sm:flex flex-col items-end">
                     <span className="text-[12px] font-bold text-on-surface leading-tight">
                       {user.name}
                     </span>
                     <span className="text-[10px] text-secondary font-medium tracking-wide uppercase">
                       {user.role}
                     </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[13px] shadow-sm">
                    {user.name[0]}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
               <Link 
                href="/login" 
                className="font-headline font-semibold tracking-tighter uppercase text-sm text-secondary hover:text-on-surface hover:opacity-80 transition-opacity"
              >
                Log In
              </Link>
              
              <Link href="/register">
                <Button size="sm" className="bg-gradient-primary">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}