"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        <div className="bg-secondary mb-4 rounded-full p-4">
          <Icon className="text-muted-foreground h-10 w-10" />
        </div>

        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {description}
        </p>

        {action && (
          <Button asChild className="mt-6">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
