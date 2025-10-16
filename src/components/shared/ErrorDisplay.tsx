"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showGoHomeButton?: boolean;
}

export default function ErrorDisplay({
  title = "Something went wrong",
  message,
  onRetry,
  showGoHomeButton = true,
}: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <Card className="border-destructive my-10">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-destructive/10 mb-4 rounded-full p-4">
          <AlertTriangle className="text-destructive h-10 w-10" />
        </div>

        <h2 className="text-destructive text-xl font-semibold">
          {title}
        </h2>
        <p className="text-muted-foreground mt-2">
          {message}
        </p>

        <div className="mt-6 flex gap-4">
          {onRetry && (
            <Button onClick={onRetry} variant="destructive">
              Try Again
            </Button>
          )}

          {showGoHomeButton && (
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
