"use client";


import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useForm,
  FormProvider
} from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  LoginSchema,
  TLoginSchema
} from "@/libs/validators/auth-validator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  BrainCircuit,
  Loader2
} from "lucide-react";


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

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: TLoginSchema) => {
    try {
      await login(values);
      toast.success("Login successful!", {
        description: "Redirecting to your feed...",
      });
      router.push("/feed");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to login: ", {
        description:
          error.response?.data?.message ||
          "Invalid credentials.",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-lg shadow-xl">
      <CardHeader className="text-center mt-1">
        <Link
          href="/"
          className="mb-4 flex items-center justify-center gap-2"
        >
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Synapse</span>
        </Link>
        <CardTitle className="text-3xl font-bold">Log In</CardTitle>
        <CardDescription>
          Welcome back! Please enter your email and password to log in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormProvider
          { ...form }
        >
          <Form
            { ...form }
          >
            <form
              onSubmit={ form.handleSubmit(onSubmit) }
              className="space-y-4"
            >
              <FormField
                control={ form.control }
                name="email"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          { ...field }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }
              />
              <FormField
                control={ form.control }
                name="password"
                render={
                  ({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/reset-password"
                          className="text-sm font-semibold text-muted-foreground hover:underline hover:text-primary"
                          tabIndex={ -1 }
                        >
                          Forgot Password? Reset now!
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          { ...field }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }
              />
              <Button
                type="submit"
                className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                disabled={ isSubmitting }
              >
                {
                  isSubmitting
                    ? <Loader2 className="animate-spin" />
                    : "Log In"
                }
              </Button>
            </form>
          </Form>
        </FormProvider>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? { " " }
          <Link
            href="/register"
            className="font-semibold text-muted-foreground hover:underline hover:text-primary ml-auto inline-block text-sm"
            tabIndex={ -1 }
          >
            Register now!
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
