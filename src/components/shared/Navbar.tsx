'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { useAuth } from '@/context/AuthContext'
import { userService } from '@/modules/services/user-service'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { UserNav } from './UserNav'
import { BrainCircuit } from 'lucide-react'
import MobileNav from '@/components/shared/MobileNav'
import SearchBar from '@/components/shared/SearchBar'
import { UserProfile } from '@/types/services/user'

export function Navbar() {
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)

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
      return <UserNav user={profile} />
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
      <div className='container h-full max-w-7xl mx-auto flex items-center gap-4'>
        {/* Left: Logo & App Name */}
        <div className='flex items-center gap-2 flex-shrink-0'>
          <div className='md:hidden'>
            <MobileNav />
          </div>
          <Link href='/' className='hidden md:flex items-center gap-2'>
            <BrainCircuit className='h-8 w-8 text-primary' />
            <p className='hidden lg:block text-xl font-bold text-foreground'>Synapse</p>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className='flex-1 flex justify-center px-4'>
          <SearchBar />
        </div>

        {/* Right: Auth/User Nav */}
        <div className='flex items-center gap-2 flex-shrink-0'>{renderAuthSection()}</div>
      </div>
    </header>
  )
}
