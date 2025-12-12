import { messageApiClient } from '@/libs/apiClient'
import {
  FetchConversationsParams,
  FetchConversationsResponse,
  FetchMessagesParams,
  FetchMessagesResponse,
} from '@/types/services/message'
import { Attachment } from './socket/socket-types'
import { Conversation } from '@/types/services/message'

export const fetchUserConversations = async ({
  limit = 20,
  cursor = null,
}: FetchConversationsParams): Promise<FetchConversationsResponse> => {
  try {
    const response = await messageApiClient.get<FetchConversationsResponse>('/conversations/me', {
      params: {
        limit,
        cursor,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user conversations:', error)
    throw error
  }
}

export const fetchMessages = async (
  conversationId: string,
  { limit = 20, cursor = null }: FetchMessagesParams = {}
): Promise<FetchMessagesResponse> => {
  try {
    const response = await messageApiClient.get<FetchMessagesResponse>(
      `conversations/${conversationId}/messages`,
      {
        params: {
          limit,
          cursor,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching messages for conversation ${conversationId}:`, error)
    throw error
  }
}

/**
 * Obtain a presigned POST request for a media file and upload the file using the request.
 * @param conversationId - The ID of the conversation.
 * @param file - The media file to upload.
 * @returns The uploaded file's metadata including type, key, name, and size.
 */
export const uploadMediaFile = async (conversationId: string, file: File): Promise<Attachment> => {
  try {
    // Step 1: Obtain the presigned POST request
    const payload = {
      conversationId,
      type: file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : 'document',
      mimeType: file.type,
      originalName: file.name,
      fileSize: file.size,
    }

    const presignedResponse = await messageApiClient.post('/media', payload)
    const { uploadUrl, fields, key } = presignedResponse.data

    // Step 2: Upload the file using the presigned POST request
    const formData = new FormData()
    Object.entries(fields).forEach(([fieldName, fieldValue]) => {
      formData.append(fieldName, fieldValue as string)
    })
    formData.append('file', file)

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`)
    }

    // Step 3: Return the uploaded file's metadata
    return {
      type: payload.type as 'image' | 'video' | 'document',
      key,
      name: file.name,
      size: file.size,
    }
  } catch (error) {
    console.error('Error uploading media file:', error)
    throw error
  }
}

/**
 * Create a new conversation or retrieve an existing one.
 * @param type - The type of conversation ('direct' or 'group').
 * @param participants - An array of participant IDs.
 * @param name - Optional name for the conversation.
 * @param avatarKey - Optional avatar key for the conversation.
 * @returns The created or retrieved conversation object.
 */
export const createConversation = async (
  type: 'direct' | 'group',
  participants: string[],
  name?: string | null,
  avatarKey?: string | null
): Promise<Conversation> => {
  try {
    const payload = {
      type,
      participants,
      name: name || null,
      avatarKey: avatarKey || null,
    }

    const response = await messageApiClient.post<{ status: string; conversation: Conversation }>(
      '/conversations',
      payload
    )
    return response.data.conversation
  } catch (error) {
    console.error('Error creating conversation:', error)
    throw error
  }
}
