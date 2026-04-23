"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

import { Suspense } from "react";

function CancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-6xl">cancel</span>
      </div>
      <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Payment Cancelled</h1>
      <p className="text-secondary max-w-md mx-auto text-lg">
        The payment process was cancelled. No charges were made. You can try again whenever you're ready.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        {eventId ? (
          <Button onClick={() => router.push(`/events/${eventId}`)} size="lg">Return to Event</Button>
        ) : (
          <Button onClick={() => router.push("/events")} size="lg">Explore Events</Button>
        )}
        <Button variant="ghost" onClick={() => router.push("/dashboard")} size="lg">Go to Dashboard</Button>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}

