import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "primary-gradient-btn text-on-primary border-none shadow-[0_4px_24px_rgba(26,28,27,0.04)] hover:opacity-90",
    secondary: "bg-surface-container-low text-on-surface border-none hover:bg-surface-container-high",
    outline: "bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors",
    ghost: "bg-transparent text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors",
    danger: "bg-error text-on-error border-none hover:opacity-90",
    success: "bg-[#EAF4EC] text-[#1F5F3E] border border-[#1F5F3E]/20 hover:bg-[#D9EBDC]", // Custom success from tags
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
    md: "px-5 py-2.5 text-sm font-semibold uppercase tracking-wider",
    lg: "px-8 py-4 text-base font-semibold tracking-tight",
  };

  return (
    <button
      {...props}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        inline-flex items-center justify-center gap-2 rounded-lg 
        font-headline transition-all duration-150 cursor-pointer 
        disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]
        ${className}
      `}
    >
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      {children}
    </button>
  );
}
