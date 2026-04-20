"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

const links = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar on auth pages (logic from Auth.jsx design)
  const isAuthPage = ["/login", "/register"].includes(pathname);
  if (isAuthPage) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] bg-background transition-colors duration-200 ${
        scrolled ? "border-b border-border-base" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-8 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-[20px] font-bold tracking-[-0.03em] text-foreground font-tight hover:opacity-80 transition-opacity"
        >
          Planora
        </Link>

        {/* Center links */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] font-medium transition-colors duration-150 pb-0.5 border-b-2 ${
                  isActive
                    ? "text-accent border-accent"
                    : "text-muted border-transparent hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex gap-2.5 items-center">
          <Link href="/login">
            <Button variant="secondary" small>
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" small>
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
