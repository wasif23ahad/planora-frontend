"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotifications";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const loggedOutLinks = [
  { label: "Events",     href: "/events" },
  { label: "Categories", href: "/events?cat=all" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
];

const loggedInLinks = [
  { label: "Events",      href: "/events" },
  { label: "Dashboard",   href: "/dashboard" },
  { label: "My Tickets",  href: "/dashboard/events" },
  { label: "Invitations", href: "/dashboard/invitations" },
  { label: "About",       href: "/about" },
  { label: "Help",        href: "/help" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { stats: notifications, dismissUpcomingEvent, markAsRead } = useNotifications();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // outside-click handler for profile menu
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest('[data-profile-menu]')) setProfileOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const links = user ? loggedInLinks : loggedOutLinks;

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
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]) && link.href !== "/events");
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
          
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-low"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-[24px]">{mobileOpen ? "close" : "menu"}</span>
          </button>

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
                  className={`font-headline font-semibold tracking-tighter uppercase text-sm transition-all duration-150 hidden lg:block
                    ${pathname.startsWith("/dashboard") 
                      ? "text-primary border-b-2 border-primary pb-1" 
                      : "text-secondary hover:text-on-surface hover:opacity-80"}`}
                >
                  Dashboard
                </Link>
                
                <div className="relative" data-profile-menu>
                  <button
                    onClick={(e) => { e.stopPropagation(); setProfileOpen(o => !o); }}
                    className="flex items-center gap-3 pl-6 border-l border-outline-variant"
                  >
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[12px] font-bold text-on-surface leading-tight">{user.name}</span>
                      <span className="text-[10px] text-secondary font-medium tracking-wide uppercase">{user.role}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[13px] shadow-sm">
                      {user.name[0]}
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl py-2 z-50 animate-slide-up">
                      <div className="px-4 py-3 border-b border-outline-variant">
                        <div className="text-sm font-bold text-on-surface">{user.name}</div>
                        <div className="text-xs text-secondary truncate">{user.email}</div>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-secondary">dashboard</span> Dashboard
                      </Link>
                      <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-secondary">person</span> Profile Settings
                      </Link>
                      <Link href="/dashboard/invitations" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-secondary">mail</span> Invitations
                      </Link>
                      {(user.role === "ADMIN" || user.role === "MANAGER") && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                          <span className="material-symbols-outlined text-[20px] text-secondary">admin_panel_settings</span> 
                          {user.role === "MANAGER" ? "Manager Panel" : "Admin Panel"}
                        </Link>
                      )}
                      <div className="h-px bg-outline-variant my-1" />
                      <button
                        onClick={() => { logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 text-left transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span> Log Out
                      </button>
                    </div>
                  )}
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

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface animate-slide-up">
          <div className="px-8 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-headline font-semibold text-sm uppercase tracking-tighter py-3 text-on-surface hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <div className="h-px bg-outline-variant my-2" />
                <Link href="/login" className="py-3 text-on-surface font-headline font-semibold text-sm uppercase">Log In</Link>
                <Link href="/register" className="py-3 text-primary font-headline font-semibold text-sm uppercase">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}