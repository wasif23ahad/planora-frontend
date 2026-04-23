"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-6xl">check_circle</span>
      </div>
      <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Payment Successful!</h1>
      <p className="text-secondary max-w-md mx-auto text-lg">
        Thank you for your registration. Your spot has been secured. You can now view your e-ticket in the dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <Button onClick={() => router.push("/dashboard")} size="lg">Go to Dashboard</Button>
        {eventId && (
          <Button variant="outline" onClick={() => router.push(`/events/${eventId}`)} size="lg">Back to Event</Button>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

