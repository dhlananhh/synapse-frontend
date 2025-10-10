"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";

interface SettingsRowProps {
  title: string;
  description: string;
  children: React.ReactNode;
  href?: string;
  isExternal?: boolean;
}

export default function SettingsRow({
  title,
  description,
  children,
  href,
  isExternal,
}: SettingsRowProps) {
  const content = (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex flex-col">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {href && !isExternal && (
          <ChevronRight className="text-muted-foreground h-5 w-5" />
        )}
        {href && isExternal && (
          <ExternalLink className="text-muted-foreground h-5 w-5" />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="hover:bg-secondary/50 block"
      >
        {content}
      </Link>
    );
  }

  return content;
}
