"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      login(response.data.token, response.data.user);
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background font-sans pt-20">
      <div className="w-full max-w-[400px] bg-white rounded-[16px] border border-border-base p-[40px_40px_36px] shadow-sm animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[22px] font-bold tracking-[-0.03em] text-foreground font-tight mb-1.5">Planora</div>
          <div className="text-[13px] text-muted">Create your account. Start hosting and attending exclusive events.</div>
        </div>

        {success ? (
          <div className="text-center py-10">
            <div className="text-[28px] mb-4">✓</div>
            <div className="text-[15px] font-bold text-success capitalize">Account created!</div>
            <div className="text-[13px] text-muted mt-2">Redirecting to dashboard…</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-danger/5 text-danger border border-danger/10 rounded-[8px] p-3 text-[13px] text-center mb-4 font-medium animate-fade-in">
                {error}
              </div>
            )}
            
            <Input
              label="Full name"
              placeholder="Sadia Islam"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full h-[42px] text-white border-none rounded-[10px] text-[14px] font-medium transition-all cursor-pointer 
                  ${isLoading ? "bg-[#9B93FF]" : "bg-accent hover:opacity-90 active:opacity-100"}`}
              >
                {isLoading ? "Creating account…" : "Create account"}
              </button>
            </div>

            <div className="text-center pt-6 text-[13px] text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-bold hover:underline">
                Log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
