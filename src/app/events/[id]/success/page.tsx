import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SuccessPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-8 bg-background">
      <div className="max-w-[440px] w-full bg-white border border-border-base rounded-2xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-[#DCFCE7] text-success rounded-full flex items-center justify-center text-[32px] mx-auto mb-6">
          ✓
        </div>
        <h1 className="text-[24px] font-bold text-foreground mb-3 font-tight tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-[14px] text-muted leading-relaxed mb-8">
          Your registration for the event is confirmed. You can now see this event in your participant dashboard.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button variant="primary" className="w-full h-[42px]">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" className="w-full h-[42px]">
              Explore more events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
