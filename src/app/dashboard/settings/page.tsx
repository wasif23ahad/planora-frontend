"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const inputStyle = "h-[40px] px-3 border border-border-base rounded-[8px] text-[14px] text-foreground bg-background outline-none w-full focus:border-accent transition-colors";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([true, true, false]);

  return (
    <div>
      <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] mb-8">Settings</h1>

      <div className="bg-white rounded-[12px] border border-border-base p-8 mb-5">
        <div className="text-[16px] font-semibold text-foreground mb-5">Profile</div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Full name", val: user?.name ?? "", col: false },
            { label: "Email", val: user?.email ?? "", col: false },
            { label: "Location", val: "Dhaka, Bangladesh", col: false },
            { label: "Bio", val: "Event organizer & community builder", col: true },
          ].map(({ label, val, col }) => (
            <div key={label} className={col ? "col-span-2" : ""}>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">{label}</label>
              <input defaultValue={val} className={inputStyle} />
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Button variant="primary" small>Save changes</Button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-border-base p-8">
        <div className="text-[16px] font-semibold text-foreground mb-5">Notifications</div>
        {[
          "Email me when someone joins my event",
          "Email me when a join request is approved",
          "Email me about new events in my area",
        ].map((label, i) => (
          <label key={i} className="flex items-center gap-2.5 mb-3.5 cursor-pointer text-[14px] text-foreground">
            <input
              type="checkbox"
              checked={notifs[i]}
              onChange={() => setNotifs(n => n.map((v, j) => j === i ? !v : v))}
              className="accent-accent w-4 h-4"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
