"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardEventsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="py-24 text-center text-secondary animate-pulse font-headline">
       Redirecting to your unified dashboard...
    </div>
  );
}