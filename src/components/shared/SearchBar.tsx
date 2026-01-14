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
import { useDebounce } from '@/hooks/useDebounce'
import { getPostSuggestions } from '@/modules/services/post-service'
import type { PostSuggestion } from '@/types/services/post'

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

  const { register, handleSubmit, watch, setValue } = useForm<TSearchSchema>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      query: searchParams.get('q') || '',
    },
  })

  const watchedQuery = watch('query') ?? ''
  const debouncedQuery = useDebounce<string>(watchedQuery, 400)

  const onSubmit = (data: TSearchSchema) => {
    router.push(`/search?q=${encodeURIComponent(data.query)}&type=post`)
    setIsOpen?.(false)
  }

  const [platform, setPlatform] = useState('')
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPlatform(window.navigator.platform.toLowerCase())
    }
  }, [])

  useEffect(() => {
    // only call API for 4+ chars (more than 3)
    if (!debouncedQuery || debouncedQuery.trim().length < 3) {
      setSuggestions([])
      setShowDropdown(false)
      setSuggestError(null)
      setSelectedIndex(-1)
      return
    }

    const controller = new AbortController()
    setSuggestLoading(true)
    setSuggestError(null)

    getPostSuggestions(debouncedQuery.trim(), 10, controller.signal)
      .then((items) => {
        const arr = items ?? []
        setSuggestions(arr)
        setShowDropdown(arr.length > 0)
        // do NOT auto-select first suggestion — let user explicitly navigate
        setSelectedIndex(-1)
      })
      .catch((err: any) => {
        if (err.name === 'AbortError') return
        setSuggestError(err?.message ?? 'Failed to load suggestions')
        setSuggestions([])
        setShowDropdown(false)
        setSelectedIndex(-1)
      })
      .finally(() => {
        setSuggestLoading(false)
      })

    return () => controller.abort()
  }, [debouncedQuery])

  const handleSelect = (s: PostSuggestion) => {
    setShowDropdown(false)
    setValue('query', s.title)
    router.push(`/search?q=${encodeURIComponent(s.title)}&type=post`)
    setIsOpen?.(false)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // If dropdown not visible or no suggestions, Enter should submit normally
    if (!showDropdown || suggestions.length === 0) {
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => {
        const next = prev + 1
        return next >= suggestions.length ? 0 : next
      })
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => {
        if (prev <= 0) return suggestions.length - 1
        return prev - 1
      })
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setShowDropdown(false)
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      // Only pick a suggestion when user actively selected one (via arrows or hover).
      if (selectedIndex >= 0) {
        const sel = suggestions[selectedIndex]
        if (sel) handleSelect(sel)
      } else {
        // No explicit selection — submit the input as entered
        handleSubmit(onSubmit)()
      }
    }
  }

  return (
    <div className='relative w-full max-w-[600px]'>
      <form onSubmit={handleSubmit(onSubmit)} className='relative w-full max-w-[600px]'>
        <div className='relative'>
          <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            {...register('query')}
            placeholder={t('navbar.search_placeholder')}
            className='pl-9'
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true)
            }}
            onBlur={() => {
              // small delay so click on suggestion registers
              setTimeout(() => setShowDropdown(false), 150)
            }}
            aria-autocomplete='list'
            aria-haspopup='listbox'
            onKeyDown={handleKeyDown}
          />
          <div className='absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-muted-foreground border rounded-sm px-1.5 py-0.5'>
            {platform && getShortcutLabel(platform)}
          </div>

          {/* suggestions dropdown */}
          {showDropdown && (
            <div className='absolute left-0 right-0 mt-2 z-50 bg-card border rounded shadow-lg overflow-hidden'>
              {suggestLoading ? (
                <div className='p-2 text-sm text-muted-foreground'>Loading...</div>
              ) : suggestError ? (
                <div className='p-2 text-sm text-destructive'>{suggestError}</div>
              ) : suggestions.length === 0 ? (
                <div className='p-2 text-sm text-muted-foreground'>No suggestions</div>
              ) : (
                <ul
                  role='listbox'
                  className='divide-y'
                  aria-activedescendant={
                    selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
                  }
                >
                  {suggestions.map((s, idx) => (
                    <li key={s.id}>
                      <button
                        id={`suggestion-${idx}`}
                        type='button'
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                        onClick={() => handleSelect(s)}
                        className={`w-full text-left p-2 hover:bg-muted/50 ${
                          idx === selectedIndex ? 'bg-muted/50' : ''
                        }`}
                        aria-selected={idx === selectedIndex}
                      >
                        <div className='font-medium text-sm truncate'>{s.title}</div>
                        <div className='text-xs text-muted-foreground mt-1'>
                          {/* optional meta */}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
