import axios from "axios"
import { authService } from "@/modules/services/auth-service"


// Base URLs
const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:4000/api/auth"
const USER_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:4002/api/users"
const COMMUNITY_SERVICE_URL =
  process.env.NEXT_PUBLIC_COMMUNITY_SERVICE_URL || "http://localhost:4003/api/communities"


const createApiClient = (baseURL: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
  return apiClient
}

const authApiClient = createApiClient(AUTH_SERVICE_URL)
const userApiClient = createApiClient(USER_SERVICE_URL)
const communityApiClient = createApiClient(COMMUNITY_SERVICE_URL)

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
          window.location.href = "/login"
        }
      }
      return Promise.reject(error)
    }
  )
}

setupInterceptors(authApiClient)
setupInterceptors(userApiClient)
setupInterceptors(communityApiClient)

export {
  authApiClient,
  userApiClient,
  communityApiClient
}
