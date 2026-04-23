"use client";

import React, { forwardRef, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextArea?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, isTextArea, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputClasses = `
      w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg 
      px-4 py-3 text-on-surface font-body text-sm placeholder-secondary 
      focus:outline-none focus:ring-0 focus:border-primary focus:border-2 
      transition-all duration-200 disabled:opacity-50
      ${error ? "border-error focus:border-error" : ""}
      ${className}
    `;

    if (isTextArea) {
      return (
        <div className="space-y-1.5 w-full">
          <label className="block font-label text-xs font-semibold text-on-surface uppercase tracking-widest">
            {label}
          </label>
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={`${inputClasses} min-h-[100px] resize-vertical`}
          />
          {error && (
            <p className="text-xs text-error font-medium animate-slide-up">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1.5 w-full">
        <label className="block font-label text-xs font-semibold text-on-surface uppercase tracking-widest">
          {label}
        </label>
        <div className="relative">
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            type={currentType}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={`${inputClasses} ${isPassword ? "pr-12" : ""}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-error font-medium animate-slide-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
