"use client"


import React from "react"
import Image from "next/image"
import { PostDetails, PostMediaType } from "@/types/services/post"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Image as ImageIcon, Video } from "lucide-react"


interface PostPreviewProps {
  post: PostDetails
}


export default function PostPreview({ post }: PostPreviewProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/c/${post.community.name}/posts/${post.id}`) // Navigate to post
  }

  const renderMediaMetadata = (mediaType: PostMediaType, mediaCount: number) => {
    return (
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-sm">
        {
          mediaType === "IMAGE"
            ? <ImageIcon className="h-3 w-3" />
            : <Video className="h-3 w-3" />
        }
        <span className="font-medium">
          { mediaCount }
        </span>
      </div>
    )
  }

  return (
    <div
      className="group p-4 border border-border rounded-lg bg-card text-card-foreground cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md relative overflow-hidden"
      onClick={ handleClick }
    >
      {/* Header Section */ }
      <div className="flex items-center gap-3 mb-2">
        {/* Community Avatar */ }
        <Avatar className="w-8 h-8 border border-border shadow-sm">
          {
            post.community.avatarUrl ? (
              <AvatarImage
                src={ post.community.avatarUrl }
                alt={ post.community.name }
              />
            ) : (
              // Fallback avatar cũng cần màu nền thích hợp
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                { post.community.name.charAt(0).toUpperCase() }
              </AvatarFallback>
            )
          }
        </Avatar>

        {/* Community Name and Timestamp */ }
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate hover:underline">
            c/{ post.community.name }
          </p>
          <p className="text-xs text-muted-foreground">
            { formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) }
          </p>
        </div>
      </div>

      {/* Post Title */ }
      <h4 className="text-sm font-medium mb-3 leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
        { post.title }
      </h4>

      {/* Media Preview */ }
      {
        post.type === "MEDIA" && post.media.length > 0 && (
          <div className="relative mb-3 rounded-md overflow-hidden bg-secondary/30">
            <Image
              src={ post.media[ 0 ].url }
              alt={ post.media[ 0 ].filename }
              width={ 400 }
              height={ 160 }
              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            { renderMediaMetadata(post.media[ 0 ].type, post.media.length) }
          </div>
        )
      }

      {/* Interactions Footer */ }
      <div className="mt-2 text-xs text-muted-foreground font-medium flex items-center gap-3 border-t border-border pt-3">
        <span className="flex items-center gap-1">
          👍 { post.score > 0 ? post.score : 0 }
        </span>
        <span className="flex items-center gap-1">
          💬 { post.commentCount } comments
        </span>
      </div>
    </div>
  )
}
