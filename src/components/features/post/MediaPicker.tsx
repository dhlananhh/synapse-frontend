'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { MAX_MEDIA } from '@/libs/validators/post-validator'
import { UploadCloud, X, Image as ImageIcon, Film, Loader2 } from 'lucide-react'
import { cn } from '@/libs/utils'
import { presignUpload } from '@/modules/services/upload-service'

interface MediaPickerProps {
  name: string // e.g. "mediaTempKeys"
  existingMedia?: {
    key: string
    url: string
    type: string
    filename: string
    size: number
    mimeType: string
    id: string
  }[]
  reuseName?: string // e.g. "reuseMediaKeys"
  multiple?: boolean
  accept?: string
}

type ItemStatus = 'queued' | 'uploading' | 'done' | 'error'

interface PreviewItem {
  url: string
  name: string
  size: number
  type: string
  key?: string // S3 object key after upload
  status?: ItemStatus
  error?: string
}

export function MediaPicker({
  name,
  accept = 'image/*,video/*',
  multiple = true,
  existingMedia = [],
  reuseName = 'reuseMediaKeys',
}: MediaPickerProps) {
  const { setValue, watch } = useFormContext()
  const [ previews, setPreviews ] = useState<PreviewItem[]>([])
  const [ isDragging, setDragging ] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const mediaTempKeys: string[] = watch(name) || []
  const reuseMediaKeys: string[] = watch(reuseName) || []

  // --- NEW: Track deleted media ---
  const [ deletedMedia, setDeletedMedia ] = useState<typeof existingMedia>([])

  const usedSlots = mediaTempKeys.length + previews.filter((p) => !p.key).length
  const remaining = Math.max(0, MAX_MEDIA - usedSlots)

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (existingMedia.length > 0 && deletedMedia.length > 0) {
      setDeletedMedia([]) // Reset deletedMedia only if it has items
    }
    if (existingMedia.length && (!reuseMediaKeys || reuseMediaKeys.length === 0)) {
      setValue(
        reuseName,
        existingMedia.map((m) => m.key),
        { shouldValidate: true }
      )
    }
    // eslint-disable-next-line
  }, [ existingMedia ])

  const openFileDialog = () => inputRef.current?.click()

  const takeUpToRemaining = (files: File[]) => {
    if (remaining <= 0) return []
    return files.slice(0, remaining)
  }

  // --- Handle File Selection ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    await handleFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  const handleFiles = async (files: File[]) => {
    const selectable = takeUpToRemaining(files)
    if (selectable.length === 0) return

    // Filter out duplicates by (name + size + type)
    const uniqueFiles = selectable.filter(
      (file) =>
        !previews.some((f) => f.name === file.name && f.size === file.size && f.type === file.type)
    )
    if (uniqueFiles.length === 0) return

    const newPreviews: PreviewItem[] = uniqueFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
    }))
    setPreviews((prev) => [ ...prev, ...newPreviews ])

    // Eager upload each unique file
    for (const file of uniqueFiles) {
      try {
        const uploadedKey = await uploadFile(file)
        if (uploadedKey) {
          const currentKeys: string[] = watch(name) || []
          setValue(name, [ ...currentKeys, uploadedKey ], { shouldValidate: true })
          setPreviews((prev) =>
            prev.map((p) =>
              p.name === file.name && p.size === file.size && p.type === file.type
                ? { ...p, key: uploadedKey, status: 'done' }
                : p
            )
          )
        }
      } catch (err: any) {
        setPreviews((prev) =>
          prev.map((p) =>
            p.name === file.name && p.size === file.size && p.type === file.type
              ? { ...p, status: 'error', error: err?.message || 'Upload failed' }
              : p
          )
        )
        // Keep preview, but don’t add key to form
      }
    }
  }

  // --- Upload to S3 using presigned POST ---
  const uploadFile = async (file: File): Promise<string | null> => {
    const category: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'
    const extension = file.name.includes('.')
      ? file.name.split('.').pop()!.toLowerCase().slice(0, 8)
      : undefined

    // 1) Ask backend for presigned POST
    const { uploadUrl, fields, key } = await presignUpload({
      mimeType: file.type,
      size: file.size,
      originalName: file.name,
      extension,
      category,
      // checksum: await sha256Hex(file) // optional if your backend uses it
    })

    // 2) Upload directly to S3 using returned form fields
    const formData = new FormData()
    Object.entries(fields).forEach(([ k, v ]) => formData.append(k, v as string))
    formData.append('file', file)

    const s3Response = await fetch(uploadUrl, { method: 'POST', body: formData })
    if (!s3Response.ok) throw new Error('S3 upload failed')

    // 3) Return temp object key for validator/mediaTempKeys
    return key
  }

  // --- Remove preview + form value ---
  const handleRemove = (keyToRemove?: string, url?: string) => {
    if (url) URL.revokeObjectURL(url)
    if (!keyToRemove) {
      // Just remove local preview (failed upload)
      setPreviews((prev) => prev.filter((p) => p.url !== url))
      return
    }
    setPreviews((prev) => prev.filter((p) => p.key !== keyToRemove))
    const updatedKeys = mediaTempKeys.filter((k) => k !== keyToRemove)
    setValue(name, updatedKeys, { shouldValidate: true })
  }

  // --- Remove existing media and track as deleted ---
  const handleRemoveExisting = (key: string) => {
    const removed = existingMedia.find((m) => m.key === key)
    if (removed) {
      setDeletedMedia((prev) => [ ...prev, removed ])
    }
    setValue(
      reuseName,
      (reuseMediaKeys || []).filter((k) => k !== key),
      { shouldValidate: true }
    )
  }

  // --- Restore deleted media ---
  const handleRestoreDeleted = (key: string) => {
    setValue(reuseName, [ ...(reuseMediaKeys || []), key ], { shouldValidate: true })
    setDeletedMedia((prev) => prev.filter((m) => m.key !== key))
  }

  // --- Drag & drop handlers ---
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }
  const onDragLeave = () => setDragging(false)
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (!e.dataTransfer.files?.length) return
    await handleFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <div className='space-y-3'>
      {/* Hidden input */ }
      <input
        ref={ inputRef }
        type='file'
        accept={ accept }
        multiple={ multiple }
        onChange={ handleFileChange }
        className='hidden'
      />

      {/* Dropzone */ }
      <div
        role='button'
        tabIndex={ 0 }
        onKeyDown={ (e) => (e.key === 'Enter' || e.key === ' ' ? openFileDialog() : null) }
        onClick={ openFileDialog }
        onDragOver={ onDragOver }
        onDragLeave={ onDragLeave }
        onDrop={ onDrop }
        className={ cn(
          'rounded-md border border-dashed p-6 text-center transition-colors',
          'bg-background/40 hover:bg-accent/30',
          isDragging ? 'border-primary bg-primary/10' : 'border-border'
        ) }
      >
        <div className='mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80'>
          <UploadCloud className='h-5 w-5 text-muted-foreground' />
        </div>
        <div className='text-sm text-muted-foreground'>
          { remaining > 0 ? (
            <>
              <p className='mb-3'>Drag & drop images or videos here</p>
              <Button type='button' variant='outline' size='sm' onClick={ openFileDialog }>
                Browse files
              </Button>
              <p className='mt-2 text-xs'>
                You can add up to { MAX_MEDIA } files. Remaining: { remaining }
              </p>
            </>
          ) : (
            <p>Maximum of { MAX_MEDIA } files reached.</p>
          ) }
        </div>
      </div>

      {/* Existing media previews */ }
      { existingMedia.filter((m) => reuseMediaKeys.includes(m.key)).length > 0 && (
        <div>
          <div className='mb-1 text-xs font-semibold text-muted-foreground'>
            Your existing media
          </div>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 border rounded-md p-3 bg-background/60'>
            { existingMedia
              .filter((m) => reuseMediaKeys.includes(m.key))
              .map((m) => (
                <div
                  key={ m.key }
                  className='relative overflow-hidden rounded-md border bg-background'
                >
                  <button
                    type='button'
                    onClick={ () => handleRemoveExisting(m.key) }
                    className='absolute right-1 top-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-background/90 text-foreground shadow hover:bg-background'
                    aria-label='Remove'
                  >
                    <X className='h-4 w-4' />
                  </button>
                  { m.mimeType.startsWith('image/') ? (
                    <Image
                      src={ m.url }
                      alt={ m.filename }
                      className='h-40 w-full object-cover'
                    />
                  ) : (
                    <video
                      src={ m.url }
                      className='h-40 w-full object-cover'
                      controls={ false }
                    />
                  ) }
                  <div className='pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[11px] text-muted-foreground ring-1 ring-border'>
                    { m.mimeType.startsWith('image/') ? (
                      <ImageIcon className='h-3.5 w-3.5' />
                    ) : (
                      <Film className='h-3.5 w-3.5' />
                    ) }
                    { m.mimeType.startsWith('image/') ? 'Image' : 'Video' }
                  </div>
                  <div className='text-xs'>{ m.filename }</div>
                </div>
              )) }
          </div>
        </div>
      ) }

      {/* Deleted media previews with restore option */ }
      { deletedMedia.length > 0 && (
        <div>
          <div className='mb-1 text-xs font-semibold text-yellow-700'>
            Removed media (can restore)
          </div>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 border rounded-md p-3 bg-yellow-50'>
            { deletedMedia.map((m) => (
              <div
                key={ m.key }
                className='relative overflow-hidden rounded-md border bg-background opacity-70'
              >
                <button
                  type='button'
                  onClick={ () => handleRestoreDeleted(m.key) }
                  className='absolute right-1 top-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-yellow-100 text-yellow-800 shadow hover:bg-yellow-200'
                  aria-label='Restore'
                >
                  <svg width='16' height='16' fill='none' viewBox='0 0 24 24'>
                    <path
                      d='M12 4v16m8-8H4'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </button>
                { m.mimeType.startsWith('image/') ? (
                  <Image
                    src={ m.url }
                    alt={ m.filename }
                    className='h-40 w-full object-cover'
                  />
                ) : (
                  <video
                    src={ m.url }
                    className='h-40 w-full object-cover'
                    controls={ false }
                  />
                ) }
                <div className='pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[11px] text-yellow-800 ring-1 ring-yellow-300'>
                  { m.mimeType.startsWith('image/') ? (
                    <ImageIcon className='h-3.5 w-3.5' />
                  ) : (
                    <Film className='h-3.5 w-3.5' />
                  ) }
                  { m.mimeType.startsWith('image/') ? 'Image' : 'Video' }
                </div>
                <div className='text-xs'>{ m.filename }</div>
              </div>
            )) }
          </div>
        </div>
      ) }

      {/* New uploads */ }
      { previews.length > 0 && (
        <div>
          <div className='mb-1 text-xs font-semibold text-muted-foreground'>New media to add</div>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 border rounded-md p-3 bg-background/60'>
            { previews.map((file) => {
              const isImage = file.type.startsWith('image/')
              const isVideo = file.type.startsWith('video/')
              return (
                <div
                  key={ file.key ?? file.url }
                  className='relative overflow-hidden rounded-md border bg-background'
                >
                  <button
                    type='button'
                    onClick={ () => handleRemove(file.key, file.url) }
                    className='absolute right-1 top-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-background/90 text-foreground shadow hover:bg-background'
                    aria-label='Remove'
                  >
                    <X className='h-4 w-4' />
                  </button>
                  { isImage ? (
                    <Image
                      src={ file.url }
                      alt={ file.name }
                      className='h-40 w-full object-cover'
                    />
                  ) : isVideo ? (
                    <video
                      src={ file.url }
                      className='h-40 w-full object-cover'
                      controls={ false }
                      muted
                      playsInline
                    />
                  ) : (
                    <div className='flex h-40 w-full items-center justify-center text-xs text-muted-foreground'>
                      { file.name }
                    </div>
                  ) }
                  <div className='pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[11px] text-muted-foreground ring-1 ring-border'>
                    { isImage ? (
                      <ImageIcon className='h-3.5 w-3.5' />
                    ) : (
                      <Film className='h-3.5 w-3.5' />
                    ) }
                    { isImage ? 'Image' : isVideo ? 'Video' : 'File' }
                  </div>
                  <div className='text-xs'>{ file.name }</div>
                  { file.status === 'uploading' && (
                    <div className='absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Uploading…
                      </div>
                    </div>
                  ) }
                  { file.status === 'error' && (
                    <div className='absolute inset-x-0 bottom-0 bg-destructive/90 p-2 text-center text-[11px] text-destructive-foreground'>
                      { file.error || 'Upload failed' }
                    </div>
                  ) }
                </div>
              )
            }) }
          </div>
        </div>
      ) }
    </div>
  )
}
