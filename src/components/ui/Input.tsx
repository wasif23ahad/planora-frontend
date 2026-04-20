import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextArea?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, isTextArea, className = "", ...props }, ref) => {
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
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as React.ForwardedRef<HTMLInputElement>}
          className={inputClasses}
        />
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
