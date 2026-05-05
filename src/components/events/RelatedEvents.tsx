"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { EventCard } from "@/components/events/EventCard";

interface Props {
  currentEventId: string | number;
  category?: string;
}

export function RelatedEvents({ currentEventId, category }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const params: Record<string, any> = { limit: 8, upcoming: true };
        if (category) params.category = category;
        const { data } = await api.get("/events", { params });
        if (!cancelled) {
          const filtered = (data.items ?? [])
            .filter((e: any) => String(e.id) !== String(currentEventId))
            .slice(0, 4);
          setItems(filtered);
        }
      } catch (err) {
        if (!cancelled) console.error("Related events failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [currentEventId, category]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="font-headline text-3xl font-semibold tracking-tighter text-on-surface mb-8">
        You might also like
      </h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[400px] bg-surface-container-low animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </section>
  );
}
