'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { postService } from '@/modules/services/post-service'
import { communityService } from '@/modules/services/community-service'
import type { PostDetails } from '@/types/services/post'
import type { CommunityRule } from '@/types/services/community'
import { Loader2 } from 'lucide-react'
import EditPostForm from '@/components/features/post/EditPostForm'
import type { TEditPostSchema } from '@/libs/validators/post-validator'
import ModerationActionCard from '@/components/features/post/ModerationActionCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function EditMyPostPage() {
  const { postId } = useParams<{ postId: string }>()
  const router = useRouter()
  const [post, setPost] = useState<PostDetails | null>(null)
  const [rules, setRules] = useState<CommunityRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rulesLoading, setRulesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rulesError, setRulesError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    postService
      .getPostById(postId)
      .then(setPost)
      .catch(() => setError('Failed to load post'))
      .finally(() => setIsLoading(false))
  }, [postId])

  useEffect(() => {
    if (!post?.community?.id) return
    let active = true
    setRulesLoading(true)
    setRulesError(null)
    communityService
      .getRules(post.community.id)
      .then((res) => {
        if (active) setRules(res || [])
      })
      .catch(() => {
        if (active) setRulesError('Failed to load rules.')
      })
      .finally(() => {
        if (active) setRulesLoading(false)
      })
    return () => {
      active = false
    }
  }, [post?.community?.id])

  const handleSubmit = async (data: TEditPostSchema) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await postService.updatePost(postId, data)
      // Optionally redirect or show a success message
      router.push(`/u/me/posts/${postId}`)
    } catch (e: any) {
      setSubmitError(e?.message || 'Failed to update post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error || !post) {
    return <div className='p-8 text-center text-destructive'>{error || 'Post not found.'}</div>
  }

  return (
    <div className='max-w-5xl mx-auto p-4 sm:p-8 bg-background rounded-2xl shadow flex flex-col md:flex-row gap-8'>
      {/* Main content (form) */}
      <div className='flex-1 min-w-0 md:basis-3/4'>
        {post.moderationAction?.action === 'REJECTED' && (
          <div className='mb-4'>
            <div className='flex items-center gap-2 mt-3 rounded-md border border-yellow-300 bg-yellow-100 px-3 py-2 text-xs text-yellow-800 shadow-sm mb-2'>
              <svg
                width='16'
                height='16'
                fill='none'
                viewBox='0 0 24 24'
                className='text-yellow-500'
              >
                <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' />
                <rect x='11' y='7' width='2' height='6' rx='1' fill='currentColor' />
                <rect x='11' y='15' width='2' height='2' rx='1' fill='currentColor' />
              </svg>
              <span>Your previous version was rejected, please be aware of the reason.</span>
            </div>
            <ModerationActionCard action={post.moderationAction} />
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>Edit Post</CardTitle>
          </CardHeader>
          <CardContent>
            <EditPostForm post={post} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            {submitError && (
              <div className='mt-4 text-destructive text-sm text-center'>{submitError}</div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Sidebar: Community Rules */}
      <div className='w-full md:w-64 shrink-0'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Community Rules</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <p className='text-md text-muted-foreground leading-relaxed'>
              Please review and abide by these rules before editing or resubmitting your post.
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
      </div>
    </div>
  )
}
