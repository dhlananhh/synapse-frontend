import React from "react";

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
