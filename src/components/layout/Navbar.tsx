"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
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
      className={`fixed top-0 left-0 right-0 h-[60px] flex items-center z-[100] transition-all bg-background
        ${scrolled ? "border-b border-border-base" : "border-b border-transparent"}`}
    >
      <div className="max-w-[1200px] w-full mx-auto px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-[20px] font-bold tracking-[-0.03em] text-foreground font-tight hover:opacity-80 transition-opacity">
          Planora
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-8 items-center h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] font-medium transition-colors h-[60px] flex items-center border-b-2 
                  ${isActive 
                    ? "text-accent border-accent" 
                    : "text-muted border-transparent hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            );
          })}
          {user && (
            <Link 
              href="/dashboard" 
              className={`text-[14px] font-medium transition-colors h-[60px] flex items-center border-b-2
                ${pathname.startsWith("/dashboard") 
                  ? "text-accent border-accent" 
                  : "text-muted border-transparent hover:text-foreground"}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-bold text-muted hidden sm:inline tabular-nums">
                {user.name.split(" ")[0]}
              </span>
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[12px]">
                {user.name[0]}
              </div>
            </div>
          ) : (
            <>
              <Link href="/login"><Button variant="secondary" small>Log in</Button></Link>
              <Link href="/register"><Button variant="primary" small>Sign up</Button></Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
