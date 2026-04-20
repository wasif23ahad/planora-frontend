"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
      // 1. Submit registration
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // 2. Automatically log them in after registration
      const loginRes = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      login(loginRes.data.token, loginRes.data.user);
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (err: unknown) {
      const message = isAxiosError<{ error?: { message?: string } }>(err)
        ? err.response?.data?.error?.message || "Registration failed. Please try again."
        : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-100 bg-white rounded-2xl border border-border-base p-10 sm:p-12 shadow-sm">
        <div className="text-center mb-8">
          <div className="text-[22px] font-bold tracking-tight mb-1.5 font-tight text-foreground">Planora</div>
          <p className="text-[13px] text-muted font-medium italic">Create your account.</p>
        </div>

        {success ? (
          <div className="text-center py-5 animate-in fade-in zoom-in duration-300">
            <div className="text-[28px] mb-3 text-success">✓</div>
            <div className="text-[15px] font-bold text-success">Account created!</div>
            <p className="text-[13px] text-muted mt-1.5">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-danger border border-red-100 rounded-lg p-3 text-[13px] text-center mb-4">
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

            <Button type="submit" className="w-full h-[42px] mt-2 font-semibold" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-center mt-5 text-[13px] text-muted">
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
