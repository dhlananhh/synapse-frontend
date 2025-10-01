import axios, {
  AxiosError,
  InternalAxiosRequestConfig
} from "axios";
import { authService } from "@/modules/services/auth-service";
import { cookieManager } from "@/libs/cookieManager";


const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/auth";
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:4002/api/users";
const COMMUNITY_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:4003/api/communities";


const createApiClient = (baseURL: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return apiClient;
};


const authApiClient = createApiClient(AUTH_SERVICE_URL);
const userApiClient = createApiClient(USER_SERVICE_URL);
const communityApiClient = createApiClient(COMMUNITY_SERVICE_URL);

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];


const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(true);
    }
  });

  failedQueue = [];
};


const setupInterceptors = (client: typeof authApiClient) => {
  client.interceptors.request.use(
    (config) => {
      const token = cookieManager.getAccessToken(); // <-- SỬA
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => client(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const storedRefreshToken = cookieManager.getRefreshToken();

        if (storedRefreshToken) {
          try {
            const response = await authService.refreshToken(storedRefreshToken);
            const { accessToken: newAccessToken } = response;

            cookieManager.setAccessToken(newAccessToken);
            if (response.refreshToken) {
              cookieManager.setRefreshToken(response.refreshToken);
            }

            processQueue(null);
            return client(originalRequest);

          } catch (refreshError) {
            cookieManager.removeAccessToken();
            cookieManager.removeRefreshToken();
            processQueue(refreshError as AxiosError);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
}



setupInterceptors(authApiClient);
setupInterceptors(userApiClient);
setupInterceptors(communityApiClient);


export { authApiClient, userApiClient, communityApiClient };
