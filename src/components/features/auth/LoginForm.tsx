"use client";


import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/modules/services/auth-service";
import { LoginPayload } from "@/types/services/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit } from "lucide-react";


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema)
  });


  const onSubmit = async (data: LoginPayload) => {
    try {
      const response = await authService.login(data);
      console.log("Login successful!", response.user);

      toast.success("Login successful! Redirecting...");

      router.push("/feed");

    } catch (error: any) {
      toast.error("Failed to login", {
        description: error.response?.data?.message || "Invalid credentials."
      });
    }
  };

  return (
    <Card className="mx-auto max-w-lg w-full">
      <CardHeader className="items-center">
        <Link
          href="/"
          className="flex flex-col items-center gap-2 mb-2"
        >
          <BrainCircuit className="h-10 w-10 text-primary" />
          <CardTitle className="text-2xl">Synapse</CardTitle>
        </Link>
        <CardDescription>
          Enter your email and password below to log in to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={ handleSubmit(onSubmit) }
          className="grid gap-4"
        >
          {/* Email */ }
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              { ...register("email") }
              id="email"
              type="email"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password */ }
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>

              <Link
                href="/reset-password"
                className="ml-auto inline-block text-sm text-muted-foreground hover:text-primary hover:underline"
                tabIndex={ -1 }
              >
                Forgot your password? Reset now!
              </Link>
            </div>

            <Input
              { ...register("password") }
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={ isSubmitting }
          >
            { isSubmitting ? "Logging in..." : "Log In" }
          </Button>

          <Button
            variant="outline"
            className="w-full"
          >
            Login with Google
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? { " " }
          <Link
            href="/register"
            className="ml-auto inline-block text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
