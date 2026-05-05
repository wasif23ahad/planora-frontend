"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const socials = [
  { label: "Facebook",  href: "https://facebook.com/planora",  icon: "facebook" /* placeholder slot */ },
  { label: "Twitter",   href: "https://twitter.com/planora",   icon: "alternate_email" },
  { label: "Instagram", href: "https://instagram.com/planora", icon: "photo_camera" },
  { label: "LinkedIn",  href: "https://linkedin.com/company/planora", icon: "work" },
  { label: "GitHub",    href: "https://github.com/wasif23ahad/planora-frontend", icon: "code" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    try {
      setSending(true);
      await api.post("/support", { content: message });
      setSent(true);
      setMessage("");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="bg-surface-container w-full mt-20 border-t border-outline-variant">
      <div className="max-w-[1440px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 font-body text-sm leading-relaxed">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="text-xl font-semibold tracking-tighter text-on-surface font-headline">Planora</span>
          <p className="text-secondary max-w-xs">
            Discover, create, and join events. Built for communities that gather with purpose.
          </p>
          <p className="text-secondary text-xs">© {currentYear} Planora. All rights reserved.</p>
        </div>

        {/* Explore */}
        <div className="flex flex-col gap-4">
          <h4 className="font-headline font-semibold text-on-surface text-xs uppercase tracking-widest">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link href="/events" className="text-secondary hover:text-primary transition-colors">Events</Link>
            <Link href="/events?cat=all" className="text-secondary hover:text-primary transition-colors">Categories</Link>
            <Link href="/dashboard" className="text-secondary hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/dashboard/events/new" className="text-secondary hover:text-primary transition-colors">Become a host</Link>
          </div>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-4">
          <h4 className="font-headline font-semibold text-on-surface text-xs uppercase tracking-widest">Resources</h4>
          <div className="flex flex-col gap-2">
            <Link href="/help" className="text-secondary hover:text-primary transition-colors">Help center</Link>
            <Link href="/blog" className="text-secondary hover:text-primary transition-colors">Blog</Link>
            <Link href="/about" className="text-secondary hover:text-primary transition-colors">About</Link>
            <Link href="/legal" className="text-secondary hover:text-primary transition-colors">Privacy &amp; Terms</Link>
            <Link href="/contact" className="text-secondary hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>

        {/* Stay in touch */}
        <div className="flex flex-col gap-4">
          <h4 className="font-headline font-semibold text-on-surface text-xs uppercase tracking-widest">Stay in touch</h4>

          <a href="mailto:contact@planora.com" className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">mail</span>
            contact@planora.com
          </a>

          {user ? (
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={sent ? "Message sent. Thanks!" : "Quick message to the team…"}
                rows={2}
                disabled={sending || sent}
                className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-xs text-on-surface focus:border-primary outline-none transition-all resize-none placeholder:text-secondary ${sent ? "border-primary/50 bg-primary/5" : ""}`}
              />
              {!sent && (
                <button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:scale-100"
                >
                  <span className="material-symbols-outlined text-base">{sending ? "sync" : "send"}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 text-center">
              <p className="text-[11px] text-secondary mb-3">Login to send us a direct message</p>
              <Link href="/login" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                Login now
              </Link>
            </div>
          )}

          {/* Social row */}
          <div className="flex items-center gap-2 mt-2">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-outline-variant">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-secondary">
          <span>Made with care in Dhaka.</span>
          <div className="flex items-center gap-4">
            <Link href="/legal" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/legal" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}