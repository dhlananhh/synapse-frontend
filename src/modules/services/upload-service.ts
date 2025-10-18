import { uploadApiClient } from '@/libs/apiClient'
import { PresignUploadPayload, PresignUploadResponse } from '@/types/services/upload'

/**
 * Obtain a presigned upload (POST /uploads/presign).
 * Note: uploadApiClient base should be something like http://host/api/uploads,
 * so the final URL resolves to /api/uploads/presign.
 */
export async function presignUpload(payload: PresignUploadPayload): Promise<PresignUploadResponse> {
  const res = await uploadApiClient.post<PresignUploadResponse>('/presign', payload)
  return res.data
}
