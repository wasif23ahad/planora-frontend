"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import api from "@/lib/api";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  date: z.string(), // We will handle future verification manually for edits to avoid blocking past events
  venue: z.string().min(2, "Venue is required"),
  category: z.string().min(1, "Please select a category"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  feeCents: z.number().min(0, "Fee cannot be negative"),
});

type EventForm = z.infer<typeof eventSchema>;

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("venue", data.venue);
        setValue("category", data.category);
        setValue("visibility", data.visibility);
        setValue("feeCents", data.feeCents);
        
        // Format date for datetime-local input (YYYY-MM-DDThh:mm)
        const dateStr = new Date(data.date).toISOString().slice(0, 16);
        setValue("date", dateStr);
        
        if (data.coverImage) setPreview(data.coverImage);
      } catch (error) {
        console.error("Failed to load event for editing:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchEvent();
  }, [id, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EventForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value.toString()));
      if (image) formData.append("coverImage", image);

      await api.patch(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Failed to update event:", error);
      alert(error.response?.data?.message || "Failed to update event. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="py-24 text-center text-muted animate-pulse">Loading event data...</div>;

  return (
    <div className="max-w-[800px] mx-auto">
      <SectionTitle>Edit Event</SectionTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 bg-white border border-border-base p-10 rounded-2xl shadow-sm">
        {/* ── IMAGE UPLOAD ─────────────────────────────────── */}
        <div className="space-y-4">
          <label className="text-[14px] font-bold text-foreground block">Event Cover Image</label>
          <div className="flex items-center gap-8">
            <div className="w-[200px] h-[150px] bg-muted/5 rounded-xl border-2 border-dashed border-border-base flex items-center justify-center overflow-hidden relative">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12px] text-muted/40 font-mono text-center px-4">No image selected</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-muted
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-accent/10 file:text-accent
                  hover:file:bg-accent/20 cursor-pointer"
              />
              <p className="text-[12px] text-muted italic">Selecting a new image will replace the current one.</p>
            </div>
          </div>
        </div>

        {/* ── BASIC INFO ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Event Title" {...register("title")} error={errors.title?.message} />
          <Input label="Venue" {...register("venue")} error={errors.venue?.message} />
          <Input label="Date" type="datetime-local" {...register("date")} error={errors.date?.message} />
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-foreground">Category</label>
            <select
              {...register("category")}
              className="w-full h-[42px] px-3.5 border border-border-base rounded-radius-input text-[14px] outline-none focus:border-accent"
            >
              <option value="Public Free">Public Free</option>
              <option value="Public Paid">Public Paid</option>
              <option value="Private Free">Private Free</option>
              <option value="Private Paid">Private Paid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Fee (Amount in Cents)" type="number" {...register("feeCents", { valueAsNumber: true })} error={errors.feeCents?.message} />
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-foreground">Visibility</label>
            <div className="flex gap-4 pt-1">
              {["PUBLIC", "PRIVATE"].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer text-[14px] font-medium text-muted">
                  <input type="radio" value={v} {...register("visibility")} className="accent-accent" />
                  {v}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] font-bold text-foreground">Description</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full p-4 border border-border-base rounded-2xl text-[14px] outline-none focus:border-accent resize-none"
          />
          {errors.description && <p className="text-[12px] text-danger font-medium">{errors.description.message}</p>}
        </div>

        <div className="pt-6 border-t border-border-base flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
