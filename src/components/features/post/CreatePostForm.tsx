'use client'

import React, { useState, useEffect } from 'react'
import { useForm, FormProvider, useWatch, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon, Image as ImageIcon, FileText } from 'lucide-react'
import { CommunitySelector } from './CommunitySelector'
import { FlairAndTagsDialog } from '@/components/features/post/dialogs/FlairAndTagsDialog'
import { communityService } from '@/modules/services/community-service'
import { CommunityFlair } from '@/types/services/community'
import { Badge } from '@/components/ui/badge'
import Editor from '@/components/shared/Editor'
import {
  CreatePostSchema,
  TCreatePostSchema,
  MAX_LINKS,
  TCreatePostInput,
} from '@/libs/validators/post-validator'
import { MediaPicker } from './MediaPicker'
import * as postService from '@/modules/services/post-service'
import NavigationDialog from '@/components/shared/NavigationDialog'
import { useRouter } from 'next/navigation'

// TEXT, MEDIA or LINK
type PostType = TCreatePostSchema['type']

interface CreatePostFormProps {
  selectedCommunityId: string
  onSelectCommunity: (id: string) => void
}

export default function CreatePostForm({
  selectedCommunityId,
  onSelectCommunity,
}: CreatePostFormProps) {
  const [flairs, setFlairs] = useState<CommunityFlair[]>([])
  const [loadingFlairs, setLoadingFlairs] = useState(false)
  const router = useRouter()
  const [showNavDialog, setShowNavDialog] = useState(false)
  const [createdPost, setCreatedPost] = useState<any>(null)

  const methods = useForm<TCreatePostInput, any, TCreatePostSchema>({
    resolver: zodResolver(CreatePostSchema),
    mode: 'onChange',
    defaultValues: {
      type: 'TEXT',
      title: '',
      contentHtml: '',
      contentJson: undefined,
      mediaTempKeys: [],
      links: [],
      flairId: '',
      taggedUserIds: [],
      isNSFW: false,
      isSpoiler: false,
      isOC: false,
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, isValid, errors },
  } = methods

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: 'links',
  })

  const postType = useWatch({ control, name: 'type' })

  // Fetch flairs when external community changes
  useEffect(() => {
    if (!selectedCommunityId) {
      setFlairs([])
      return
    }
    let active = true
    setLoadingFlairs(true)
    communityService
      .getFlairs(selectedCommunityId)
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
  }, [selectedCommunityId])

  const onSubmit = async (data: TCreatePostSchema) => {
    const created = await postService.createPost(selectedCommunityId, data)
    setCreatedPost(created)
    setShowNavDialog(true)
  }

  const handleTabChange = (val: string) => {
    setValue('type', val as PostType, { shouldDirty: true, shouldValidate: true })
  }

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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <input type='hidden' {...register('flairId')} />
        <input type='hidden' {...register('isNSFW')} />
        <input type='hidden' {...register('isSpoiler')} />
        <input type='hidden' {...register('isOC')} />

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold'>Create Post</CardTitle>
          </CardHeader>
          <CardContent className='pt-0 space-y-6'>
            <div className='space-y-2'>
              <CommunitySelector
                label='Community'
                value={selectedCommunityId || ''}
                onChange={(id) => {
                  onSelectCommunity(id)
                }}
              />
              <p className='text-xs text-muted-foreground'>
                You can only post to communities that you are a member of.
              </p>
            </div>

            <div
              className={`space-y-2 ${
                !selectedCommunityId ? 'opacity-50 pointer-events-none select-none' : ''
              }`}
            >
              <div className='flex items-center gap-3'>
                <FlairAndTagsDialog
                  flairs={flairs}
                  disabled={!selectedCommunityId || loadingFlairs}
                />
                {loadingFlairs && (
                  <span className='text-xs text-muted-foreground flex items-center gap-1'>
                    Loading…
                  </span>
                )}
              </div>
              <FlairTagsSummary />
            </div>
            <hr />

            <Tabs value={postType} onValueChange={handleTabChange}>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='TEXT' className='flex items-center gap-2'>
                  <FileText className='h-4 w-4' />
                  Text
                </TabsTrigger>
                <TabsTrigger value='MEDIA' className='flex items-center gap-2'>
                  <ImageIcon className='h-4 w-4' />
                  Media
                </TabsTrigger>
                <TabsTrigger value='LINK' className='flex items-center gap-2'>
                  <LinkIcon className='h-4 w-4' />
                  Link
                </TabsTrigger>
              </TabsList>

              <div className='mt-5 space-y-2'>
                <label className='text-sm font-medium' htmlFor='title'>
                  Title
                </label>
                <textarea
                  id='title'
                  placeholder={`Enter a descriptive ${postType === 'MEDIA' ? 'caption' : 'title'}`}
                  {...register('title')}
                  className='w-full rounded-md border border-gray-300 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary'
                  rows={1} // Start with 1 row
                  style={{ maxHeight: '6rem', overflowY: 'auto' }} // Limit to 3 rows (approx. 6rem)
                />
                {errors.title && (
                  <p className='text-xs text-destructive'>{errors.title.message as string}</p>
                )}
              </div>

              <TabsContent value='TEXT' className='mt-6 space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Body</label>
                  <Editor communityId={selectedCommunityId} disabled={!selectedCommunityId} />
                  {(errors.contentHtml || errors.contentJson) && (
                    <p className='text-xs text-destructive'>
                      {(errors.contentHtml?.message as string) ||
                        (errors.contentJson?.message as string)}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='MEDIA' className='mt-6 space-y-4'>
                <div className='rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground'>
                  {/* <p className='mb-3'>Media uploader placeholder (populate mediaTempKeys)</p> */}
                  <MediaPicker name='mediaTempKeys' multiple />
                  {errors.mediaTempKeys && (
                    <p className='mt-2 text-xs text-destructive'>
                      {errors.mediaTempKeys.message as string}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Optional Caption</label>
                  <Editor communityId={selectedCommunityId} disabled={!selectedCommunityId} />
                  {(errors.contentHtml || errors.contentJson) && (
                    <p className='text-xs text-destructive'>
                      {(errors.contentHtml?.message as string) ||
                        (errors.contentJson?.message as string)}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='LINK' className='mt-6 space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium'>Links (max {MAX_LINKS})</label>
                    {linkFields.length < MAX_LINKS && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => appendLink('')}
                      >
                        Add Link
                      </Button>
                    )}
                  </div>
                  <div className='space-y-2'>
                    {linkFields.length === 0 && (
                      <p className='text-xs text-muted-foreground'>
                        Add at least one link to post.
                      </p>
                    )}
                    {linkFields.map((field, idx) => (
                      <div key={field.id} className='flex items-center gap-2'>
                        <Input
                          placeholder='https://example.com'
                          {...register(`links.${idx}` as const)}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeLink(idx)}
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
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Optional Commentary</label>
                  <Editor communityId={selectedCommunityId} disabled={!selectedCommunityId} />
                  {(errors.contentHtml || errors.contentJson) && (
                    <p className='text-xs text-destructive'>
                      {(errors.contentHtml?.message as string) ||
                        (errors.contentJson?.message as string)}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' disabled={isSubmitting}>
            Save Draft (TODO)
          </Button>
          <Button
            type='submit'
            disabled={
              isSubmitting ||
              !selectedCommunityId ||
              !isValid ||
              (postType === 'LINK' && linkFields.length === 0)
            }
          >
            {isSubmitting ? 'Submitting...' : 'Post'}
          </Button>
        </div>
      </form>
      {/* Navigation Dialog */}
      <NavigationDialog
        open={showNavDialog}
        onOpenChange={setShowNavDialog}
        options={[
          {
            label: 'Go to your post',
            onClick: () => {
              if (createdPost?.post.id) {
                router.push(`/u/me/posts/${createdPost.post.id}`)
              }
            },
          },
          {
            label: 'Go to homepage',
            onClick: () => router.push('/'),
            variant: 'secondary',
          },
        ]}
      />
    </FormProvider>
  )
}
