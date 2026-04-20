import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CancelPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-8 bg-background">
      <div className="max-w-[440px] w-full bg-white border border-border-base rounded-2xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-[#FEE2E2] text-danger rounded-full flex items-center justify-center text-[32px] mx-auto mb-6">
          ✕
        </div>
        <h1 className="text-[24px] font-bold text-foreground mb-3 font-tight tracking-tight">
          Payment Cancelled
        </h1>
        <p className="text-[14px] text-muted leading-relaxed mb-8">
          The payment process was cancelled and you haven't been charged. You can try joining the event again when you're ready.
        </p>
        <div className="flex flex-col gap-3">
          <Link href={`/events/${params.id}`}>
            <Button variant="primary" className="w-full h-[42px]">
              Try Again
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" className="w-full h-[42px]">
              Explore other events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
