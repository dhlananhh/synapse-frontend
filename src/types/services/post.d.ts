import { TCreatePostSchema } from '@/libs/validators/post-validator'

// alias for clarity
export type CreatePostPayload = TCreatePostSchema

// Adjust to your backend response shape
export interface CreatePostResponse {
  id: string
  // ...add fields returned by your API (slug, url, createdAt, etc.)
}

export type PostType = 'TEXT' | 'MEDIA' | 'LINK'

export interface ModerationAction {
  id: string
  action: string
  reason: string
  actorId: string
  createdAt: string
}

// media objects attached to MEDIA posts (present but can be empty on other types)
export type PostMediaType = 'IMAGE' | 'VIDEO'
export interface PostMedia {
  id: string
  key: string
  type: PostMediaType
  filename: string
  size: number
  mimeType: string
  url: string
}

// status is flexible in case backend adds more
export type PostStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | string

// unified post DTO (fields exist for all types; arrays may be empty)
export interface Post {
  id: string
  authorId: string
  community: PostCommunity
  status: PostStatus
  type: PostType
  title: string
  contentHtml: string
  isNSFW: boolean
  isSpoiler: boolean
  isOC: boolean
  links: string[]
  flairId: string | null
  createdAt: string
  currentVersionId: string
  media: PostMedia[]
  taggedUserIds: string[]
}

export interface PostCommunity {
  id: string
  name: string
  avatarKey?: string
  isPrivate?: boolean
  avatarUrl?: string
}

export interface PostDetails {
  id: string
  authorId: string
  community: PostCommunity
  status: string
  type: string
  flairId: string | null
  isOC: boolean
  isNSFW: boolean
  isSpoiler: boolean
  title: string
  score: number
  currentUserVote: 'UPVOTE' | 'DOWNVOTE' | null
  contentJson?: any
  contentHtml: string
  links: string[]
  currentVersionId: string
  createdAt: string
  numOfVersions: number
  media: PostMedia[]
  taggedUserIds: string[]
  moderationAction: ModerationAction | null
}

export type ListCommunityPostsParams = {
  cursor?: string | null
  limit?: number // 1..100 (default 20)
  authorId?: 'me' | string
  flairId?: string
  nsfw?: boolean
  q?: string
  // Accept array or CSV string for types
  types?: PostType[] | string
  sort?: 'new' | 'oldest' | 'top'
}

export type ListCommunityPostsResponse = {
  posts: PostDetails[]
  pagination?: { hasMore: boolean; nextCursor: string | null }
}

export interface PostVersion {
  id: string
  versionNumber: number
  createdAt: string
  type: PostType
  title: string
  flairId: string | null
  contentHtml: string
  links: string[]
  versionTags: string[]
  versionMedia: PostMedia[]
  moderationAction: ModerationAction | null
}
