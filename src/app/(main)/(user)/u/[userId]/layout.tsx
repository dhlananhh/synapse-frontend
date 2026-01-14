import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'

type LayoutProps = {
  children: React.ReactNode
}

export async function generateMetadata(
  props: { params: Promise<{ userId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { userId } = await props.params
  return {
    title: `Profile of @${userId} | Synapse`,
    description: `View the profile, posts, and activity of ${userId} on Synapse.`,
  }
}

export default function Layout({ children }: LayoutProps) {
  return <div className='container max-w-4xl px-4 py-16 ml-68'>{children}</div>
}
