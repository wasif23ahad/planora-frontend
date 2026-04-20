"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(10, "Please provide a more detailed description").max(5000),
  date: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Event date must be in the future",
  }),
  venue: z.string().min(2, "Venue is required"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  feeCents: z.preprocess((v) => Number(v), z.number().min(0, "Fee cannot be negative")),
  coverImage: z.string().optional(),
});

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: { visibility: "PUBLIC", feeCents: 0 },
  });

  const onSubmit = async (data: EventForm) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/events", data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full h-[40px] px-3 border border-border-base rounded-[8px] text-[14px] outline-none focus:border-accent bg-background text-foreground";

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-muted text-[14px] cursor-pointer hover:text-foreground bg-none border-none font-inherit">← Back</button>
        <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] m-0">Create event</h1>
      </div>

      <div className="bg-white rounded-[12px] border border-border-base p-8">
        {error && (
          <div className="mb-6 p-3 bg-danger/5 text-danger border border-danger/10 rounded-[8px] text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Event title</label>
              <input {...register("title")} placeholder="e.g. Dhaka Startup Mixer" className={inputStyle} />
              {errors.title && <p className="text-[12px] text-danger mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Date & time</label>
              <input type="datetime-local" {...register("date")} className={inputStyle} />
              {errors.date && <p className="text-[12px] text-danger mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Venue</label>
              <input {...register("venue")} placeholder="e.g. The Daily Star Centre" className={inputStyle} />
              {errors.venue && <p className="text-[12px] text-danger mt-1">{errors.venue.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Registration fee (cents, 0 = free)</label>
              <input type="number" min={0} {...register("feeCents")} placeholder="0" className={inputStyle} />
              {errors.feeCents && <p className="text-[12px] text-danger mt-1">{errors.feeCents.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Visibility</label>
              <select {...register("visibility")} className={inputStyle}>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Cover image URL (optional)</label>
              <input {...register("coverImage")} placeholder="https://..." className={inputStyle} />
            </div>

            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Description</label>
              <textarea
                {...register("description")}
                placeholder="Describe your event…"
                rows={4}
                className="w-full px-3 py-2.5 border border-border-base rounded-[8px] text-[14px] outline-none focus:border-accent bg-background text-foreground resize-vertical"
              />
              {errors.description && <p className="text-[12px] text-danger mt-1">{errors.description.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create event"}
            </Button>
            <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
