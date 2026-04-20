import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-base bg-background font-sans mt-auto">
      <div className="max-w-[1200px] mx-auto px-8 py-20 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="text-[20px] font-bold tracking-[-0.03em] text-foreground font-tight hover:opacity-80 transition-opacity">
            Planora
          </div>
          <p className="text-[13px] text-muted leading-relaxed max-w-[180px]">
            Create, discover, and join events. Build community, one gathering at a time.
          </p>
        </div>
        
        {[
          { h: "Platform", l: ["Browse Events", "Create Event", "Pricing", "Features"] },
          { h: "Company", l: ["Our Story", "Blog", "Careers", "Support"] },
          { h: "Legal", l: ["Privacy", "Terms", "Cookies", "Safety"] },
        ].map(c => (
          <div key={c.h} className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted">{c.h}</h4>
            <ul className="space-y-2">
              {c.l.map(link => (
                <li key={link}>
                  <button className="text-[14px] text-muted hover:text-accent transition-colors">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-[1200px] mx-auto px-8 py-8 border-t border-border-base text-[12px] text-muted text-center italic">
        © 2026 Planora. All rights reserved. Registered trademark of Planora Inc.
      </div>
    </footer>
  );
}
