'use client'

import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Editor from '@/components/shared/Editor'
import { MediaPicker } from './MediaPicker'
import { Badge } from '@/components/ui/badge'
import { EditPostSchema, TEditPostSchema } from '@/libs/validators/post-validator'
import type { PostDetails } from '@/types/services/post'
import { useEffect, useState } from 'react'
import { communityService } from '@/modules/services/community-service'
import { CommunityFlair } from '@/types/services/community'
import { FlairAndTagsDialog } from '@/components/features/post/dialogs/FlairAndTagsDialog'

interface EditPostFormProps {
  post: PostDetails
  onSubmit: (data: TEditPostSchema) => Promise<void>
  isSubmitting?: boolean
}

export default function EditPostForm({ post, onSubmit, isSubmitting }: EditPostFormProps) {
  const methods = useForm<TEditPostSchema>({
    resolver: zodResolver(EditPostSchema(post.id, post.type)),
    defaultValues: {
      title: post.title,
      contentHtml: post.contentHtml,
      contentJson: post.contentJson,
      links: post.links,
      mediaTempKeys: [],
      reuseMediaKeys: post.media?.map((m) => m.key as string) || [],
      flairId: post.flairId,
      taggedUserIds: post.taggedUserIds,
      isNSFW: post.isNSFW,
      isSpoiler: post.isSpoiler,
      isOC: post.isOC,
      // editReason: '',
      // isMinorEdit: false,
    },
    mode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = methods
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control, name: 'links' })

  // Fetch flairs for the post's community
  const [flairs, setFlairs] = useState<CommunityFlair[]>([])
  const [loadingFlairs, setLoadingFlairs] = useState(false)

  useEffect(() => {
    let active = true
    setLoadingFlairs(true)
    communityService
      .getFlairs(post.community.id)
      .then((res) => {
        if (!active) return
        setFlairs((res || []) as CommunityFlair[])
      })
      .catch(() => {
        if (!active) return
        setFlairs([])
      })
      .finally(() => {
        if (active) setLoadingFlairs(false)
      })
    return () => {
      active = false
    }
  }, [post.community.id])

  // Flair/tags summary (copied from CreatePostForm)
  const FlairTagsSummary = () => {
    const flairId = methods.watch('flairId')
    const isNSFW = methods.watch('isNSFW')
    const isSpoiler = methods.watch('isSpoiler')
    const isOC = methods.watch('isOC')
    const flair = flairs.find((f) => f.id === flairId)
    if (!flair && !isNSFW && !isSpoiler && !isOC) {
      return <p className='text-xs text-muted-foreground'>No flair or tags selected.</p>
    }
    return (
      <div className='flex flex-wrap items-center gap-2 mt-2'>
        {flair && (
          <Badge variant='outline' className='pr-2 pl-1 flex items-center gap-1 border-dashed'>
            <span
              className='h-3 w-3 rounded-full ring-1 ring-border'
              style={{ backgroundColor: flair.color || '#CBD5E1' }}
            />
            {flair.name}
          </Badge>
        )}
        {isNSFW && (
          <Badge variant='destructive' className='uppercase tracking-wide'>
            NSFW
          </Badge>
        )}
        {isSpoiler && (
          <Badge variant='secondary' className='uppercase tracking-wide'>
            Spoiler
          </Badge>
        )}
        {isOC && (
          <Badge variant='outline' className='uppercase tracking-wide'>
            OC
          </Badge>
        )}
      </div>
    )
  }

  // Render fields based on post.type
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Community info */}
        <div>
          <Badge>c/{post.community.name}</Badge>
        </div>
        {/* Flair and tags */}
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <FlairAndTagsDialog flairs={flairs} disabled={loadingFlairs} />
            {loadingFlairs && (
              <span className='text-xs text-muted-foreground flex items-center gap-1'>
                Loading…
              </span>
            )}
          </div>
          <FlairTagsSummary />
          <hr />
        </div>
        {/* Title */}
        <div>
          <label className='text-sm font-medium'>Title</label>
          <Input {...register('title')} />
          {errors.title && (
            <p className='text-xs text-destructive'>{errors.title.message as string}</p>
          )}
        </div>
        {/* Conditional fields */}
        {post.type === 'TEXT' && (
          // <section className='rounded-xl border bg-background/70 shadow-sm p-4 space-y-4'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-base font-semibold'>Body</span>
              <span className='text-xs text-muted-foreground'>
                (Write or edit the content of your post)
              </span>
            </div>
            <Editor communityId={post.community.id} />
            {(errors.contentHtml || errors.contentJson) && (
              <p className='text-xs text-destructive mt-1'>
                {(errors.contentHtml?.message as string) || (errors.contentJson?.message as string)}
              </p>
            )}
          </div>
          // </section>
        )}
        {post.type === 'MEDIA' && (
          <section className='rounded-xl border bg-background/70 shadow-sm p-4 space-y-5'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-base font-semibold'>Media</span>
              <span className='text-xs text-muted-foreground'>
                (Add or remove images/videos for your post)
              </span>
            </div>
            <MediaPicker
              name='mediaTempKeys'
              reuseName='reuseMediaKeys'
              existingMedia={post.media}
              multiple
            />
            {/* Show message if no media selected */}
            {methods.watch('mediaTempKeys')?.length === 0 &&
              methods.watch('reuseMediaKeys')?.length === 0 && (
                <div className='rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-xs text-destructive flex items-center gap-2 mt-2'>
                  <span>⚠️</span>
                  <span>Add at least one media to post.</span>
                </div>
              )}
            {/* Optional caption editor */}
            <div className='space-y-1 pt-2'>
              <label className='text-sm font-medium block mb-1'>Optional Caption</label>
              <Editor communityId={post.community.id} disabled={isSubmitting} />
              {(errors.contentHtml || errors.contentJson) && (
                <p className='text-xs text-destructive mt-1'>
                  {(errors.contentHtml?.message as string) ||
                    (errors.contentJson?.message as string)}
                </p>
              )}
            </div>
          </section>
        )}
        {post.type === 'LINK' && (
          <div className='space-y-4'>
            {/* Links input */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium'>Links (max {10})</label>
                {linkFields.length < 10 && (
                  <Button type='button' variant='outline' size='sm' onClick={() => appendLink('')}>
                    Add Link
                  </Button>
                )}
              </div>
              <div className='space-y-2'>
                {linkFields.length === 0 && (
                  <p className='text-xs text-muted-foreground'>Add at least one link to post.</p>
                )}
                {linkFields.map((field, idx) => (
                  <div key={field.id} className='flex items-center gap-2'>
                    <Input
                      placeholder='https://example.com'
                      {...register(`links.${idx}` as const)}
                      disabled={isSubmitting}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeLink(idx)}
                      disabled={isSubmitting}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              {errors.links && (
                <p className='text-xs text-destructive'>{errors.links.message as string}</p>
              )}
            </div>
            {/* Optional caption editor */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Optional Commentary</label>
              <Editor communityId={post.community.id} disabled={isSubmitting} />
              {(errors.contentHtml || errors.contentJson) && (
                <p className='text-xs text-destructive'>
                  {(errors.contentHtml?.message as string) ||
                    (errors.contentJson?.message as string)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        {!isDirty && (
          <div className='flex items-center gap-2 mt-3 rounded-md border border-yellow-300 bg-yellow-100 px-3 py-2 text-xs text-yellow-800 shadow-sm'>
            <svg width='16' height='16' fill='none' viewBox='0 0 24 24' className='text-yellow-500'>
              <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' />
              <rect x='11' y='7' width='2' height='6' rx='1' fill='currentColor' />
              <rect x='11' y='15' width='2' height='2' rx='1' fill='currentColor' />
            </svg>
            <span>Make some changes to enable saving.</span>
          </div>
        )}
        <Button type='submit' disabled={isSubmitting || !isValid || !!errors.root || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        {errors?.root && <div className='text-destructive text-sm mt-2'>{errors.root.message}</div>}
        {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
      </form>
    </FormProvider>
  )
}
