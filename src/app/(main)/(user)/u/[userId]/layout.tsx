import { Metadata, ResolvingMetadata } from "next";
import React from "react";


export async function generateMetadata(
  props: {
    params: Promise<{ userId: string }>
  }, parent?: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const userId = decodeURIComponent(String(params.userId));
  return {
    title: `Profile of @${userId} | Synapse`,
    description: `View the profile, posts, and activity of ${userId} on the Synapse discussion forum.`,
  };
}


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-4xl px-4 py-16 ml-68">
      { children }
    </div>
  );
}
