import { z } from 'zod'

/**
 * Shared constants (keep in sync with backend)
 */
export const MAX_TITLE = 300
export const MAX_LINKS = 10
export const MAX_MEDIA = 10 // sync with backend upload.maxFilesPerRequest
export const MAX_TAGGED = 50
export const MAX_CONTENT_JSON_BYTES = 200_000

// "Temporary" S3 Object Key pattern
const TEMP_KEY_REGEX = new RegExp(
  '^temp/users/[^/]+/\\d{8}/(image|video)/[^/]+(?:\\.[a-z0-9]{1,8})?$',
  'i'
)

/**
 * Helper: test if HTML has meaningful (non‑whitespace) text after stripping tags.
 */
export const hasMeaningfulHtml = (html?: string) => {
  if (!html) return false
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
  return text.length > 0
}

/**
 * Base structural schema (field-level constraints only)
 */
const BaseCreatePostSchema = z.object({
  type: z.enum(['TEXT', 'MEDIA', 'LINK']).default('TEXT'),
  title: z
    .string()
    .max(MAX_TITLE)
    .optional()
    .transform((v) => v ?? ''),
  contentHtml: z.string().optional(),
  contentJson: z.any().optional(),
  mediaTempKeys: z.array(z.string().regex(TEMP_KEY_REGEX)).max(MAX_MEDIA).default([]),
  links: z.array(z.string().url()).max(MAX_LINKS).default([]),
  flairId: z.string().nullable().optional(),
  taggedUserIds: z.array(z.string()).max(MAX_TAGGED).default([]),
  isNSFW: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
  isOC: z.boolean().optional(),
})

/**
 * Cross-field & conditional validation (mirrors backend Joi logic)
 */
export const CreatePostSchema = BaseCreatePostSchema.superRefine((data, ctx) => {
  const { type, contentHtml, contentJson, mediaTempKeys, links } = data

  // TEXT
  if (type === 'TEXT') {
    if (!contentJson) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'contentJson required for TEXT posts',
        path: ['contentJson'],
      })
    }
    if (!hasMeaningfulHtml(contentHtml)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'contentHtml required for TEXT posts',
        path: ['contentHtml'],
      })
    }
    if (mediaTempKeys.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No media allowed for TEXT posts',
        path: ['mediaTempKeys'],
      })
    }
    if (links.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No links allowed for TEXT posts',
        path: ['links'],
      })
    }
  }

  // MEDIA
  if (type === 'MEDIA') {
    if (!mediaTempKeys.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one mediaTempKey required for MEDIA posts',
        path: ['mediaTempKeys'],
      })
    }
    if (links.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Links not allowed for MEDIA posts',
        path: ['links'],
      })
    }
    if (contentHtml && !hasMeaningfulHtml(contentHtml)) {
      data.contentHtml = '' // normalization
    }
  }

  // LINK
  if (type === 'LINK') {
    if (!links.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one link required for LINK posts',
        path: ['links'],
      })
    }
    if (mediaTempKeys.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Media not allowed for LINK posts',
        path: ['mediaTempKeys'],
      })
    }
    if (contentHtml && !hasMeaningfulHtml(contentHtml)) {
      data.contentHtml = ''
    }
  }

  // Duplicate media keys
  if (mediaTempKeys.length) {
    const setSize = new Set(mediaTempKeys).size
    if (setSize !== mediaTempKeys.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate mediaTempKeys detected',
        path: ['mediaTempKeys'],
      })
    }
  }

  // contentJson size guard
  if (contentJson) {
    try {
      const jsonSize = new Blob([JSON.stringify(contentJson)]).size
      if (jsonSize > MAX_CONTENT_JSON_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'contentJson too large (>200KB)',
          path: ['contentJson'],
        })
      }
    } catch {
      // ignore serialization errors
    }
  }
})

export type TCreatePostSchema = z.infer<typeof CreatePostSchema>
export type TCreatePostInput = z.input<typeof CreatePostSchema>

/**
 * (Optional) Retain simple PostSchema if used elsewhere.
 * If not needed, you can safely remove below block.
 */
export const PostSchema = z.object({
  title: z.string().min(3).max(128),
  communityId: z.string(),
  content: z.any(),
  flairId: z.string().optional(),
})
export type TPostSchema = z.infer<typeof PostSchema>

// Helper: Permanent S3 Object Key pattern for a given postId
export const buildPermKeyRegex = (postId: string) =>
  new RegExp(
    `^private/posts/${postId}/(image|video)/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\\.[a-z0-9]{1,8})?$`,
    'i'
  )

const BaseEditPostSchema = z.object({
  title: z.string().max(MAX_TITLE).optional(),
  contentHtml: z.string().optional(),
  contentJson: z.any().optional(),
  links: z.array(z.string().url()).max(MAX_LINKS).optional(),
  mediaTempKeys: z.array(z.string().regex(TEMP_KEY_REGEX)).max(MAX_MEDIA).optional(),
  reuseMediaKeys: z.array(z.string()).optional(), // regex checked in main schema
  flairId: z.string().nullable().optional(),
  taggedUserIds: z.array(z.string()).max(MAX_TAGGED).optional(),
  isNSFW: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
  isOC: z.boolean().optional(),
  // editReason: z.string().max(500).optional(),
  // isMinorEdit: z.boolean().optional(),
})

export const EditPostSchema = (postId: string, postType?: string) => {
  const PERM_KEY_REGEX = buildPermKeyRegex(postId)

  return BaseEditPostSchema.extend({}).superRefine((data, ctx) => {
    // For LINK posts
    if (postType === 'LINK') {
      if (!data.links || data.links.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one link is required for LINK posts.',
          path: ['links'],
        })
      }
      if (
        (data.mediaTempKeys && data.mediaTempKeys.length > 0) ||
        (data.reuseMediaKeys && data.reuseMediaKeys.length > 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Media is not allowed for LINK posts.',
          path: ['mediaTempKeys'],
        })
      }
    }

    // For TEXT posts
    if (postType === 'TEXT') {
      // Require body/content
      if (!data.contentJson) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Body is required for TEXT posts.',
          path: ['contentJson'],
        })
      }
      if (!hasMeaningfulHtml(data.contentHtml)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Body is required for TEXT posts.',
          path: ['contentHtml'],
        })
      }
      if (
        (data.mediaTempKeys && data.mediaTempKeys.length > 0) ||
        (data.reuseMediaKeys && data.reuseMediaKeys.length > 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Media is not allowed for TEXT posts.',
          path: ['mediaTempKeys'],
        })
      }
    }

    // For MEDIA posts
    if (postType === 'MEDIA') {
      const numMedia = (data.mediaTempKeys?.length || 0) + (data.reuseMediaKeys?.length || 0)
      if (numMedia < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one media is required for MEDIA posts.',
          path: ['mediaTempKeys'],
        })
      }
    }

    // Combine all media keys for duplicate check
    const allMedia = [...(data.mediaTempKeys || []), ...(data.reuseMediaKeys || [])]
    if (allMedia.length && new Set(allMedia).size !== allMedia.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate media keys detected',
        path: ['mediaTempKeys'],
      })
    }

    // Normalize contentHtml if only whitespace
    if (data.contentHtml && !hasMeaningfulHtml(data.contentHtml)) {
      data.contentHtml = ''
    }
  })
}

export type TEditPostSchema = z.infer<typeof BaseEditPostSchema>
