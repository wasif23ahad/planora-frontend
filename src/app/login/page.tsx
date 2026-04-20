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
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      login(response.data.token, response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-surface-container-lowest rounded-xl border border-outline-variant/20 ambient-shadow p-8 flex flex-col items-center">
        {/* Brand / Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-semibold text-on-surface mb-2">Planora</h1>
          <p className="font-body text-secondary text-sm">Manage your community with confidence.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-error/5 text-error border border-error/10 rounded-lg p-3 text-xs text-center mb-6 font-medium animate-slide-up">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-4">
            <Input
              label="Email Address"
              placeholder="hello@planora.com"
              {...register("email")}
              error={errors.email?.message}
            />
            
            <div className="space-y-1.5">
               <div className="flex justify-between items-center">
                  <label className="block font-label text-xs font-semibold text-on-surface uppercase tracking-widest">Password</label>
                  <Link href="#" className="font-body text-xs text-primary hover:text-primary-container transition-colors duration-200">Forgot?</Link>
               </div>
               <Input
                 label="" // Label handled above
                 type="password"
                 placeholder="••••••••"
                 {...register("password")}
                 error={errors.password?.message}
               />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Please wait…" : "Log In"}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="font-body text-sm text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary-container font-medium transition-colors duration-200 underline decoration-primary underline-offset-4 hover:opacity-80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}