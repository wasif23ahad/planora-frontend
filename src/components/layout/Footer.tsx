import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-base bg-background py-16 px-8 mt-auto">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="text-[20px] font-bold tracking-[-0.03em] font-tight text-foreground">Planora</div>
          <p className="text-muted text-sm leading-relaxed max-w-[200px]">
            The modern events platform for Dhaka's growing community.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-sm text-foreground mb-5 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/events" className="hover:text-accent transition-colors">Browse Events</Link></li>
            <li><Link href="/dashboard" className="hover:text-accent transition-colors">Create Event</Link></li>
            <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-foreground mb-5 uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-foreground mb-5 uppercase tracking-wider">Support</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/help" className="hover:text-accent transition-colors">Help Center</Link></li>
            <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-border-base flex flex-col md:flex-row justify-between items-center text-xs text-muted gap-4">
        <div>© 2026 Planora. All rights reserved. Built for the community.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
          <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
