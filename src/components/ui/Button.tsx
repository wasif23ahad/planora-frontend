import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  small?: boolean;
}

export function Button({
  children,
  variant = "primary",
  small = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-opacity duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-inherit";
  
  const variants = {
    primary: "bg-accent text-white",
    secondary: "bg-transparent text-foreground border border-border-base",
    ghost: "bg-transparent text-muted underline",
    danger: "bg-danger text-white",
    success: "bg-success text-white",
  };

  const sizes = small ? "text-[13px] px-3.5 py-1.5 rounded-[10px]" : "text-[14px] px-5 py-2.5 rounded-[10px]";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes} hover:opacity-80 active:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
