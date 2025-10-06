'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { useCommandMenu } from '@/context/CommandMenuContext'
import { SearchIcon } from 'lucide-react'

const SearchSchema = z.object({
  query: z.string().min(1, { message: 'Search query cannot be empty.' }),
})
type TSearchSchema = z.infer<typeof SearchSchema>

function getShortcutLabel(platform: string) {
  if (platform.includes('mac'))
    return (
      <>
        <span className='text-lg'>⌘</span>K
      </>
    )
  return <>Ctrl K</>
}

export default function SearchBar() {
  const { t } = useTranslation()

  const router = useRouter()
  const searchParams = useSearchParams()
  const { setIsOpen } = useCommandMenu()

  const { register, handleSubmit } = useForm<TSearchSchema>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      query: searchParams.get('q') || '',
    },
  })

  const onSubmit = (data: TSearchSchema) => {
    router.push(`/search?q=${encodeURIComponent(data.query)}`)
  }

  const [platform, setPlatform] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPlatform(window.navigator.platform.toLowerCase())
    }
  }, [])

  return (
    <div className='relative w-full max-w-lg'>
      <form onSubmit={handleSubmit(onSubmit)} className='relative w-full max-w-lg'>
        <div className='relative'>
          <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            {...register('query')}
            placeholder={t('navbar.search_placeholder')}
            className='pl-9'
          />
          <div className='absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-muted-foreground border rounded-sm px-1.5 py-0.5'>
            {platform && getShortcutLabel(platform)}
          </div>
        </div>
      </form>
    </div>
  )
}
