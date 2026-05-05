"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={`w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-low transition-colors ${className}`}
    >
      <span className="material-symbols-outlined text-[22px]">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
