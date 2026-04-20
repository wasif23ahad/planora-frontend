"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

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
    <footer className="bg-[#EEEEEB] dark:bg-stone-950 w-full mt-20 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-[1440px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 font-body text-sm leading-relaxed">
        {/* Brand & Copyright */}
        <div className="flex flex-col gap-4">
          <span className="text-lg font-semibold tracking-tighter text-stone-900 dark:text-stone-50 font-headline">Planora</span>
          <p className="text-[#5B5B58] dark:text-stone-400">© {currentYear > 2024 ? currentYear : 2026} Planora. All rights reserved.</p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-headline font-semibold text-stone-900 dark:text-stone-50 text-sm uppercase tracking-widest">Company</h4>
          <div className="flex flex-col gap-2">
            <Link href="/about" className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-primary underline-offset-4 transition-all">About</Link>
            <Link href="/contact" className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-primary underline-offset-4 transition-all">Contact</Link>
            <Link href="/legal" className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-primary underline-offset-4 transition-all">Legal</Link>
          </div>
        </div>

        {/* Contact/Message Section */}
        <div className="flex flex-col gap-4">
           <h4 className="font-headline font-semibold text-stone-900 dark:text-stone-50 text-sm uppercase tracking-widest">Contact</h4>
           <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-50 font-medium">
                 <span className="material-symbols-outlined text-base">mail</span>
                 <a href="mailto:contact@planora.com" className="hover:text-primary transition-colors">contact@planora.com</a>
              </div>

              <div className="space-y-3">
                 {user ? (
                    <div className="relative group">
                       <textarea 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={sent ? "Message sent! Thank you." : "Send us a quick message..."}
                          rows={2}
                          disabled={sending || sent}
                          className={`w-full bg-surface-container-lowest dark:bg-stone-900 border border-outline-variant/30 rounded-lg px-4 py-3 text-xs text-stone-900 dark:text-stone-50 focus:border-primary outline-none transition-all resize-none shadow-sm placeholder:text-stone-400 ${sent ? "border-primary/50 bg-primary/5 dark:bg-primary/5" : ""}`}
                       />
                       {!sent && (
                          <button 
                             onClick={handleSend}
                             disabled={sending || !message.trim()}
                             className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:scale-100"
                          >
                             <span className="material-symbols-outlined text-base">
                                {sending ? "sync" : "send"}
                             </span>
                          </button>
                       )}
                    </div>
                 ) : (
                    <div className="bg-surface-container-low dark:bg-stone-900/50 border border-outline-variant/20 rounded-lg p-4 text-center">
                       <p className="text-[11px] text-secondary mb-3">Login to send us a direct message</p>
                       <Link href="/login">
                          <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                             Login now
                          </button>
                       </Link>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}