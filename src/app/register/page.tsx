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
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl border border-outline-variant/20 ambient-shadow p-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-semibold text-on-surface mb-2">Planora</h1>
          <p className="font-body text-secondary text-sm">Create your account. Join the community.</p>
        </div>

        {success ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="text-[48px] mb-4 text-primary">✓</div>
            <div className="text-xl font-bold font-headline text-on-surface">Account created!</div>
            <div className="text-sm text-secondary mt-2">Redirecting to dashboard…</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            {error && (
              <div className="bg-error/5 text-error border border-error/10 rounded-lg p-3 text-xs text-center mb-4 font-medium animate-slide-up">
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

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </div>

            <div className="text-center pt-6 text-sm text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline decoration-primary underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
