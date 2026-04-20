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
  category: z.string().min(1, "Please select a category"),
  fee: z.number().min(0, "Fee cannot be negative"), // BDT
});

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: { visibility: "PUBLIC", fee: 0 },
  });

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
    setError(null);
    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("venue", data.venue);
      formData.append("visibility", data.visibility);
      formData.append("category", data.category);
      formData.append("feeCents", Math.round(data.fee * 100).toString()); // Convert BDT to Cents

      // Append image if selected
      if (image) {
        formData.append("coverImage", image);
      }

      await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to launch event. Please verify all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <header className="space-y-4">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] leading-none">
           <button onClick={() => router.back()} className="hover:text-primary transition-colors">Dashboard</button>
           <span className="material-symbols-outlined text-[14px] opacity-30">chevron_right</span>
           <span className="text-on-surface">New Event</span>
        </nav>
        <h1 className="font-headline text-4xl font-semibold tracking-[-0.04em] text-on-surface">Launch a new experience</h1>
        <p className="text-secondary mt-1 max-w-2xl text-sm leading-relaxed">Define your event details below. Once published, your community will be notified and can begin registering immediately.</p>
      </header>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-8 md:p-12 ambient-shadow">
        {error && (
          <div className="mb-8 p-4 bg-error/5 text-error border border-error/10 rounded-xl text-xs font-semibold animate-slide-up flex items-center gap-3">
             <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* ── IMAGE SECTION ─────────────────────────────────── */}
          <div className="space-y-4">
             <label className="block font-label text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Visual Identity</label>
             <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="w-full sm:w-[240px] aspect-video bg-surface-container border-2 border-dashed border-outline-variant/20 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                   {preview ? (
                     <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                   ) : (
                     <div className="flex flex-col items-center gap-2 opacity-30">
                        <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                     </div>
                   )}
                </div>
                <div className="flex-1 space-y-3 w-full">
                   <p className="text-xs text-secondary leading-relaxed">Upload a high-resolution cover image. This will be the first thing participants see.</p>
                   <label className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg cursor-pointer border border-outline-variant/10">
                      <span className="material-symbols-outlined text-lg text-primary">upload_file</span>
                      <span className="text-xs font-bold text-on-surface uppercase tracking-tight">Select File</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                   </label>
                </div>
             </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* ── CORE DETAILS ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            <div className="md:col-span-2">
              <Input 
                label="Event Title" 
                placeholder="e.g. Dhaka Founders Mixer" 
                {...register("title")} 
                error={errors.title?.message} 
              />
            </div>

            <div className="md:col-span-2">
               <Input 
                label="Location / Venue" 
                placeholder="e.g. The Daily Star Centre, Floor 3" 
                {...register("venue")} 
                error={errors.venue?.message} 
              />
            </div>

            <Input 
              label="Date & Time" 
              type="datetime-local" 
              {...register("date")} 
              error={errors.date?.message} 
            />

            <div className="space-y-1.5">
               <label className="block font-label text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Visibility</label>
               <select 
                 {...register("visibility")} 
                 className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:outline-none focus:ring-0 focus:border-primary focus:border-2 transition-all duration-200"
               >
                 <option value="PUBLIC">Public — Discoverable by everyone</option>
                 <option value="PRIVATE">Private — Invitation only</option>
               </select>
            </div>

            <div className="space-y-1.5">
               <label className="block font-label text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Category</label>
               <select 
                 {...register("category")} 
                 className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:outline-none focus:ring-0 focus:border-primary focus:border-2 transition-all duration-200"
               >
                 {["Workshop", "Conference", "Meetup", "Social", "Educational", "Business", "Other"].map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
            </div>

            <Input 
              label="Registration Fee (BDT)" 
              type="number" 
              step="0.01"
              min={0} 
              {...register("fee", { valueAsNumber: true })} 
              placeholder="0.00 for free" 
              error={errors.fee?.message} 
            />

            <div className="md:col-span-2">
              <Input
                label="Detailed Description"
                placeholder="What should guests expect? Mention the agenda, speakers, or requirements."
                isTextArea
                {...register("description")}
                error={errors.description?.message}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-12 border-t border-outline-variant/10">
            <Button size="lg" type="submit" disabled={loading} icon="rocket_launch" className="px-10">
              {loading ? "Publishing..." : "Launch Event"}
            </Button>
            <Button variant="ghost" type="button" onClick={() => router.back()} className="text-secondary hover:text-error hover:bg-error/5">
              Discard Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
