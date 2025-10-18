// Matches server Joi: /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i
export type PresignUploadPayload = {
  mimeType: string
  size: number
  originalName?: string
  extension?: string
  checksum?: string
  category?: 'image' | 'video'
}

export type PresignUploadResponse = {
  key: string
  uploadUrl: string
  fields: Record<string, string>
  expiresIn: number
  mimeType: string
  sizeLimit: number
  originalName?: string
}
