import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-secondary flex min-h-screen items-center justify-center p-4">
      {children}
    </main>
  );
}
