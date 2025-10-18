'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import CreatePostForm from '@/components/features/post/CreatePostForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { communityService } from '@/modules/services/community-service'
import { CommunityRule } from '@/types/services/community'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

export default function SubmitPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [selectedCommunityId, setSelectedCommunityId] = useState('')
  const [rules, setRules] = useState<CommunityRule[]>([])
  const [rulesLoading, setRulesLoading] = useState(false)
  const [rulesError, setRulesError] = useState<string | null>(null)

  // Auth redirect
  useEffect(() => {
    if (isLoading) return
    if (!user) router.replace('/login?from=/submit')
  }, [user, isLoading, router])

  // Fetch rules when selected community changes
  useEffect(() => {
    if (!selectedCommunityId) {
      setRules([])
      return
    }
    let active = true
    ;(async () => {
      setRulesLoading(true)
      setRulesError(null)
      try {
        const res = await communityService.getRules(selectedCommunityId)
        if (active) setRules(res || [])
      } catch (e) {
        if (active) {
          setRules([])
          setRulesError('Failed to load rules.')
        }
      } finally {
        if (active) setRulesLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [selectedCommunityId])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }
  if (!user) return null

  return (
    <div className='mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]'>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
            <CardDescription>Share your thoughts with a community.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CreatePostForm
                selectedCommunityId={selectedCommunityId}
                onSelectCommunity={setSelectedCommunityId}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Rules sidebar (only when a community chosen) */}
      {selectedCommunityId && (
        <aside className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Community Rules</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-md text-muted-foreground leading-relaxed'>
                Please review, consult, and abide by these rules before submitting your post.
                Failing to follow them may result in removal or moderation action.
              </p>
              {rulesLoading ? (
                <p className='text-sm text-muted-foreground'>Loading rules...</p>
              ) : rulesError ? (
                <p className='text-sm text-destructive'>{rulesError}</p>
              ) : rules.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No rules defined.</p>
              ) : (
                <ul className='space-y-3 text-sm'>
                  {rules
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((rule) => (
                      <li key={rule.id} className='border rounded-md p-3'>
                        <div className='font-medium'>{rule.title}</div>
                        {rule.description && (
                          <>
                            <Separator className='my-2' />
                            <p className='text-muted-foreground whitespace-pre-line'>
                              {rule.description}
                            </p>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </aside>
      )}
    </div>
  )
}
