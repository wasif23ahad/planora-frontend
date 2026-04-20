import React, { forwardRef, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="mb-4 space-y-1.5">
        <label className="block text-[13px] font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full h-[42px] px-3.5 border rounded-radius-input text-[14px] font-inherit bg-background transition-all duration-150 outline-none
              ${focused ? "border-accent" : "border-border-base"}
              ${error ? "border-danger" : ""}
            `}
          />
        </div>
        {error && <p className="text-[12px] text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
