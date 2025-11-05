import axios from 'axios'
import { authService } from '@/modules/services/auth-service'
import { report } from 'process'

// Base URLs
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://192.168.1.5:4000/api/auth'
const USER_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://192.168.1.5:4002/api/users'
const COMMUNITY_SERVICE_URL = process.env.NEXT_PUBLIC_COMMUNITY_SERVICE_URL || 'HTTP://NOTHING'
const UPLOAD_SERVICE_URL =
  process.env.NEXT_PUBLIC_UPLOAD_SERVICE_URL || 'http://192.168.1.5:4003/api/upload'
const POST_SERVICE_URL =
  process.env.NEXT_PUBLIC_POST_SERVICE_URL || 'http://localhost:4003/api/posts'
const COMMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || 'http://localhost:4003/api/comments'

const MESSAGE_SERVICE_URL =
  process.env.NEXT_PUBLIC_MESSAGE_SERVICE_URL || 'http://localhost:4005/api/conversations'

const FEED_SERVICE_URL =
  process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'http://localhost:4004/api/feed'

const REPORT_SERVICE_URL =
  process.env.NEXT_PUBLIC_REPORT_SERVICE_URL || 'http://localhost:4003/api/reports'

const createApiClient = (baseURL: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // ensures cookies are sent with requests
  })
  return apiClient
}

const authApiClient = createApiClient(AUTH_SERVICE_URL)
const userApiClient = createApiClient(USER_SERVICE_URL)
const communityApiClient = createApiClient(COMMUNITY_SERVICE_URL)
const uploadApiClient = createApiClient(UPLOAD_SERVICE_URL)
const postApiClient = createApiClient(POST_SERVICE_URL)
const commentApiClient = createApiClient(COMMENT_SERVICE_URL)
const messageApiClient = createApiClient(MESSAGE_SERVICE_URL)
const feedApiClient = createApiClient(FEED_SERVICE_URL)
const reportApiClient = createApiClient(REPORT_SERVICE_URL)

// --------------------
// Interceptors
// --------------------
const setupInterceptors = (client: typeof authApiClient) => {
  // No need to manually attach Authorization header or handle accessToken

  // Handle 401 responses (optional: redirect to login)
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Optionally, call refresh endpoint or redirect to login
        try {
          await authService.refreshToken()
          // After refresh, you may want to reload the page or retry the request
          window.location.reload()
        } catch {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )
}

setupInterceptors(authApiClient)
setupInterceptors(userApiClient)
setupInterceptors(communityApiClient)
setupInterceptors(uploadApiClient)
setupInterceptors(postApiClient)
setupInterceptors(commentApiClient)
setupInterceptors(messageApiClient)
setupInterceptors(feedApiClient)
setupInterceptors(reportApiClient)

export {
  authApiClient,
  userApiClient,
  communityApiClient,
  uploadApiClient,
  postApiClient,
  commentApiClient,
  messageApiClient,
  feedApiClient,
  reportApiClient,
}
