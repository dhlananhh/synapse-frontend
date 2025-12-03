'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, MessageCircleMore, Bell, BrainCircuit } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { userService } from '@/modules/services/user-service'
import { useChatStore } from '@/store/useChatStore'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { UserNav } from './UserNav'
import MobileNav from '@/components/shared/MobileNav'
import SearchBar from '@/components/shared/SearchBar'
import { UserProfile } from '@/types/services/user'

import NotificationPopover from '@/components/shared/NotificationPopover'

export function Navbar() {
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const toggleChat = useChatStore((state) => state.toggleChat)

  useEffect(() => {
    if (user?.id) {
      userService.getUserProfile(user.id).then(setProfile)
    } else {
      setProfile(null)
    }
  }, [user?.id])

  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <div className='flex items-center gap-2'>
          <Skeleton className='h-10 w-20 rounded-md' />
          <Skeleton className='h-10 w-24 rounded-md' />
        </div>
      )
    }

    if (user && profile) {
      return (
        <div className='flex items-center gap-4'>
          <Button asChild>
            <Link href='/submit' className='flex items-center gap-2'>
              <PlusCircle className='w-5 h-5' />
              Create Post
            </Link>
          </Button>

          <NotificationPopover
            initialNotifications={[]}
            onOpen={() => {
              // place to fetch/subscribe to notifications (e.g. call socket or API)
              console.log('Notifications opened')
            }}
          />

          <div
            className='cursor-pointer p-2 rounded hover:bg-muted/50 transition flex items-center gap-2'
            onClick={toggleChat}
            title='Toggle Chat'
          >
            <MessageCircleMore className='w-8 h-8' />
          </div>
          <UserNav user={profile} role={user.role} />
        </div>
      )
    }

    return (
      <div className='flex items-center gap-2'>
        <Button variant='ghost' asChild>
          <Link href='/login'>Log In</Link>
        </Button>
        <Button asChild>
          <Link href='/register'>Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <header className='fixed top-0 inset-x-0 h-16 z-50 border-b bg-background/80 backdrop-blur-lg'>
      <div className='container h-full max-w-full mx-auto flex items-center justify-between px-4'>
        {/* Left: Logo & App Name */}
        <div className='flex items-center gap-2'>
          <Link href='/home' className='flex items-center gap-2'>
            <BrainCircuit className='h-8 w-8 text-primary' />
            <p className='hidden lg:block text-xl font-bold text-foreground'>Synapse</p>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className='flex-1 flex justify-center'>
          <SearchBar />
        </div>

        {/* Right: Auth/User Nav */}
        <div className='flex items-center gap-2'>{renderAuthSection()}</div>
      </div>
    </header>
  )
}
