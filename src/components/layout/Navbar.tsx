"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthPage = ["/login", "/signup", "/register"].includes(pathname);
  if (isAuthPage) return null;

  return (
    <nav 
      className={`sticky top-0 z-50 bg-[#FAFAF7] dark:bg-stone-900 w-full transition-all duration-200 border-b
        ${scrolled ? "border-stone-200 dark:border-stone-800 shadow-sm" : "border-transparent"}`}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="text-2xl font-semibold tracking-tighter text-stone-900 dark:text-stone-50 font-headline hover:opacity-80 transition-opacity">
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
                      : "text-secondary dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className={`font-headline font-semibold tracking-tighter uppercase text-sm transition-all duration-150 hidden sm:block
                  ${pathname.startsWith("/dashboard") 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-secondary dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80"}`}
              >
                Dashboard
              </Link>
              
              <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[12px] font-bold text-stone-900 dark:text-stone-50 leading-tight">
                     {user.name}
                   </span>
                   <span className="text-[10px] text-secondary dark:text-stone-400 font-medium tracking-wide uppercase">
                     {user.role}
                   </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[13px] shadow-sm">
                  {user.name[0]}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                href="/login" 
                className="font-headline font-semibold tracking-tighter uppercase text-sm text-secondary dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity"
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