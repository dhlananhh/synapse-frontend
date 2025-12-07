'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import PostCard from '@/components/features/post/PostCard'
import { getPostById } from '@/modules/services/post-service'
import type { PostDetails } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'
import { fetchPostComments, fetchCommentContext } from '@/modules/services/comment-service'
import type { Comment as CommentType } from '@/types/services/comment'
import CommentList from '@/components/features/comment/CommentList'
import CommentForm from '@/components/features/comment/CommentForm'
import { useCommunityFlairs } from '@/context/CommunityContext'
import { userService } from '@/modules/services/user-service'
import { Lock } from 'lucide-react'

export interface CommentNode extends CommentType {
  replies?: CommentNode[]
}

export default function PostDetailsPage() {
  const { postId } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [ post, setPost ] = useState<PostDetails | null>(null)
  const [ authorProfile, setAuthorProfile ] = useState<SimpleProfile | null>(null)
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState<string | null>(null)
  const [ comments, setComments ] = useState<CommentNode[]>([])
  const [ commentsLoading, setCommentsLoading ] = useState(true)
  const [ contextMode, setContextMode ] = useState(false)
  const [ highlightedCommentId, setHighlightedCommentId ] = useState<string | null>(null)
  const flairs = useCommunityFlairs()

  useEffect(() => {
    function extractErrorInfo(err: any) {
      try {
        // Axios-style
        if (err?.response?.data) {
          const d = err.response.data
          return {
            message: d.message ?? String(d),
            status: d?.error?.status ?? err?.response?.status,
          }
        }
        // fetch() Response thrown as text/json string
        if (err instanceof Error)
          return { message: err.message, status: (err as any).status ?? null }
        if (typeof err === 'string') return { message: err, status: null }
      } catch {
        // ignore parse errors
      }
      return { message: 'Failed to load post.', status: null }
    }

    async function fetchPostAndProfile() {
      try {
        const data = await getPostById(postId as string)
        setPost(data)
        // Fetch author simple profile
        const profiles = await userService.getSimpleProfiles([ data.authorId ])
        setAuthorProfile(profiles[ 0 ])
      } catch (err) {
        const info = extractErrorInfo(err)
        // prefer server message when available
        if (info.status === 404) {
          setError(
            info.message || 'The post you are looking for has been removed or is unavailable.'
          )
        } else {
          setError(info.message || 'Failed to load post.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (postId) fetchPostAndProfile()
  }, [ postId ])

  // load full comments
  const loadComments = useCallback(async () => {
    setCommentsLoading(true)
    try {
      const res = await fetchPostComments(postId as string)
      setComments(res.comments)
      setContextMode(false)
      setHighlightedCommentId(null)
      // remove context query param if present
      try {
        const params = new URLSearchParams(searchParams?.toString() ?? '')
        params.delete('contextComment')
        const dest = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname
        router.replace(dest)
      } catch {
        /* ignore */
      }
    } catch {
      // handle error if needed
    } finally {
      setCommentsLoading(false)
    }
  }, [ postId, searchParams, router ])

  // initial comments load
  useEffect(() => {
    if (!postId) return
    // if there's a context request param, the other effect will handle it
    const contextCommentId = searchParams?.get('contextComment')
    if (!contextCommentId) {
      void loadComments()
    }
  }, [ postId, loadComments, searchParams ])

  // load context chain if contextComment param present
  useEffect(() => {
    const contextCommentId = searchParams?.get('contextComment')
    if (!postId || !contextCommentId) return

    let mounted = true
    setCommentsLoading(true)
      ; (async () => {
        try {
          const chainResp = await fetchCommentContext(contextCommentId)

          if (!mounted) return

          const chain: CommentNode[] = Array.isArray(chainResp)
            ? (chainResp as CommentNode[])
            : (chainResp as any)?.comments ?? []

          if (!chain.length) {
            // fallback to full comments if no chain returned
            await loadComments()
            return
          }

          // set context comments + highlight
          setComments(chain)
          setContextMode(true)
          setHighlightedCommentId(contextCommentId)

          // wait a tick for DOM to render then scroll into view
          requestAnimationFrame(() => {
            const el = document.getElementById(`comment-${contextCommentId}`)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          })

          // Delay clearing the query param so other effects don't immediately re-run and overwrite state.
          // You can shorten/lengthen the timeout or remove this logic and clear only on user action.
          setTimeout(() => {
            try {
              const params = new URLSearchParams(window.location.search)
              params.delete('contextComment')
              const dest = params.toString()
                ? `${window.location.pathname}?${params.toString()}`
                : window.location.pathname
              // replace without scrolling and without causing immediate reload effects
              router.replace(dest, { scroll: false })
            } catch {
              /* ignore */
            }
          }, 1000)
        } catch (err) {
          // fallback to full comments on error
          await loadComments()
        } finally {
          if (mounted) setCommentsLoading(false)
        }
      })()

    return () => {
      mounted = false
    }
    // note: intentionally depend only on postId (and not on searchParams) so clearing the query doesn't re-run this effect
  }, [ postId, loadComments, router, searchParams ])

  function handleCommentAdded() {
    if (postId) {
      void fetchPostComments(postId as string).then((res) => setComments(res.comments))
    }
  }

  if (loading) return <div>Loading post...</div>
  if (error) return <div>{ error }</div>
  if (!post) return <div>Post not found.</div>

  // Find the correct flair by id
  const flair = post.flairId ? flairs.find((f) => f.id === post.flairId) : null

  const allowNewComments = post?.status !== 'LOCKED'

  return (
    <div className='flex justify-center py-4'>
      <div className='max-w-3xl'>
        <PostCard post={ post } authorProfile={ authorProfile } flair={ flair } />
        <div className='mt-4'>
          <h2 className='text-lg font-semibold mb-4'>Comments</h2>

          { contextMode && (
            <div className='mb-3'>
              <button
                className='px-3 py-1 rounded-md bg-gray-800 text-sm'
                onClick={ () => {
                  void loadComments()
                } }
              >
                View full thread
              </button>
            </div>
          ) }

          { allowNewComments ? (
            <CommentForm postId={ post.id } onSuccess={ handleCommentAdded } />
          ) : (
            <div
              role='status'
              aria-live='polite'
              className='mb-4 flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50/80 to-transparent shadow-sm'
            >
              <div className='flex-shrink-0'>
                <div className='w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center'>
                  <Lock className='w-4 h-4 text-amber-700' />
                </div>
              </div>

              <div className='flex-1 min-w-0'>
                <div className='text-foreground font-semibold'>This post is locked</div>
                <div className='mt-1 text-sm text-amber-800/90 font-bold'>
                  Comments are read‑only — you can view existing comments<br></br> but cannot submit
                  new ones.
                </div>
              </div>
            </div>
          ) }
          { commentsLoading ? (
            <div>Loading comments...</div>
          ) : (
            <CommentList
              communityId={ post.community.id }
              comments={ comments }
              postId={ post.id }
              onCommentAdded={ handleCommentAdded }
              contextMode={ contextMode }
              highlightedCommentId={ highlightedCommentId }
              allowNewComments={ allowNewComments }
            />
          ) }
        </div>
      </div>
    </div>
  )
}
