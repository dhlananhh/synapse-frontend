import { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: { userId: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = props.params;
  const userId = decodeURIComponent(params.userId);

  return {
    title: `Profile of @${userId} | Synapse`,
    description: `View the profile, posts, and activity of ${userId} on the Synapse discussion forum.`,
  };
}

export default function UserProfileLayout({
  children,
  params,
}: Props) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
