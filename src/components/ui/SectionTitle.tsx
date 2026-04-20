import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, subtitle, action, className = "" }: SectionTitleProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ${className}`}>
      <div>
        <h2 className="font-headline text-3xl font-semibold tracking-[-0.03em] text-on-surface leading-tight">
          {children}
        </h2>
        {subtitle && (
          <p className="text-secondary text-sm font-medium mt-1 uppercase tracking-[0.1em]">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
