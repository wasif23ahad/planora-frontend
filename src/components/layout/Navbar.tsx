"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthPage = ["/login", "/register"].includes(pathname);
  if (isAuthPage) return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[50] flex items-center justify-between w-full px-8 py-4 
        bg-[#FAFAF7] dark:bg-stone-900 
        ${scrolled ? "border-b border-stone-200 dark:border-stone-800" : "border-b border-transparent"}
        transition-all duration-200`}
    >
      {/* Logo */}
      <Link href="/" className="text-2xl font-semibold tracking-tighter text-stone-900 dark:text-stone-50 font-[Inter_Tight] hover:opacity-80 transition-opacity">
        Planora
      </Link>

      {/* Navigation Links - Hidden on mobile */}
      <div className="hidden md:flex gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm 
                ${isActive 
                  ? "text-stone-900 dark:text-stone-50 border-b-2 border-primary pb-1" 
                  : "text-[#5B5B58] dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Actions */}
      <div className="hidden md:flex gap-4 items-center">
        {user ? (
          <>
            <Link 
              href="/dashboard" 
              className={`font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm 
                ${pathname.startsWith("/dashboard") 
                  ? "text-stone-900 dark:text-stone-50 border-b-2 border-primary pb-1" 
                  : "text-[#5B5B58] dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity"}`}
            >
              Dashboard
            </Link>
            
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-muted hidden sm:inline tabular-nums">
                {user.name.split(" ")[0]}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px]">
                {user.name[0]}
              </div>
            </div>
          </>
        ) : (
          <>
            <Link 
              href="/login" 
              className="font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm text-[#5B5B58] dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity"
            >
              Log In
            </Link>
            
            <Link 
              href="/register"
              className="bg-gradient-primary text-on-primary px-4 py-2 rounded-lg font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm hover:opacity-80 transition-opacity active:scale-[0.99] duration-150"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}