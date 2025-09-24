import { Metadata, ResolvingMetadata } from "next";
import React from "react";


type Props = {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
};


export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const username = decodeURIComponent(params.username);

  return {
    title: `Profile of @${username} | Synapse`,
    description: `View the profile, posts, and activity of ${username} on the Synapse discussion forum.`,
  };
}


export default function UserProfileLayout({ children }: Props) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      { children }
    </div>
  );
}
