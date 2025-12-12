import { Metadata, ResolvingMetadata } from "next";
import React from "react";


type Props = {
  params: { userId: string };
  children: React.ReactNode;
};


export async function generateMetadata(
  props: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const userId = decodeURIComponent(String(props.params.userId));
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
