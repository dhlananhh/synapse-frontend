"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/context/AuthContext";
import { authService } from "@/modules/services/auth-service";
import { LoginPayload } from "@/types/services/auth";
import {
  LoginSchema,
  TLoginSchema,
} from "@/libs/validators/auth-validator";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const { register, handleSubmit } = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: TLoginSchema) => {
    try {
      await login(values);
      toast.success("Login successful!", {
        description: "Redirecting to your feed...",
        duration: 2000,
      });

      router.push("/feed");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to login", {
        description:
          error.response?.data?.message ||
          "Invalid credentials.",
        duration: 2000,
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="items-center text-center">
        <Link
          href="/"
          className="mb-2 flex flex-col items-center gap-2"
        >
          <BrainCircuit className="text-primary h-10 w-10" />
          <CardTitle className="text-2xl">
            Synapse
          </CardTitle>
        </Link>
        <CardTitle className="mt-5 text-2xl uppercase">
          Log In
        </CardTitle>
        <CardDescription>
          Enter your email and password below to log in to
          your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>

              <Link
                href="/reset-password"
                className="text-muted-foreground hover:text-primary ml-auto inline-block text-sm hover:underline"
                tabIndex={-1}
              >
                Forgot your password? Reset now!
              </Link>
            </div>

            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-muted-foreground hover:text-primary ml-auto inline-block text-sm hover:underline"
            passHref
          >
            Register now!
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
