"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";

const inputStyle = "h-[40px] px-3 border border-outline-variant/30 rounded-[8px] text-[14px] text-on-surface bg-surface-container-low outline-none w-full focus:border-primary transition-colors";

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifs, setNotifs] = useState([true, true, false]);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem("Full name") as HTMLInputElement).value;
    const bio = (form.elements.namedItem("Bio") as HTMLInputElement).value;
    
    setSaving(true);
    try {
      await api.patch("/users/profile", { name, bio });
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-headline text-[28px] font-semibold text-on-surface tracking-[-0.02em] mb-8">Settings</h1>

      <form onSubmit={handleSave} className="bg-surface-container-lowest rounded-[12px] border border-outline-variant/30 p-8 mb-6 ambient-shadow">
        <div className="text-[16px] font-bold text-on-surface mb-5 uppercase tracking-widest text-xs opacity-60">Profile</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full name", val: user?.name ?? "", col: false },
            { label: "Email", val: user?.email ?? "", col: false, disabled: true },
            { label: "Location", val: "Dhaka, Bangladesh", col: false },
            { label: "Bio", val: "Event organizer & community builder", col: true },
          ].map(({ label, val, col, disabled }) => (
            <div key={label} className={col ? "md:col-span-2" : ""}>
              <label className="block text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">{label}</label>
              <input 
                name={label} 
                defaultValue={val} 
                className={inputStyle} 
                disabled={disabled}
              />
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-outline-variant/10">
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>

      <div className="bg-surface-container-lowest rounded-[12px] border border-outline-variant/30 p-8 ambient-shadow">
        <div className="text-[16px] font-bold text-on-surface mb-5 uppercase tracking-widest text-xs opacity-60">Notifications</div>
        <div className="space-y-4">
          {[
            "Email me when someone joins my event",
            "Email me when a join request is approved",
            "Email me about new events in my area",
          ].map((label, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer text-[14px] text-on-surface group">
              <input
                type="checkbox"
                checked={notifs[i]}
                onChange={() => setNotifs(n => n.map((v, j) => j === i ? !v : v))}
                className="accent-primary w-4 h-4 rounded cursor-pointer"
              />
              <span className="group-hover:text-primary transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
