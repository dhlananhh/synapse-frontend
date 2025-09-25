import axios, {
  AxiosError,
  InternalAxiosRequestConfig
} from "axios";
import { authService } from "@/modules/services/auth-service";
import {
  getToken,
  setToken
} from "@/libs/tokenManager";


const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.5:4000/api/auth";
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://192.168.1.5:4002/api/users";


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
      const token = getToken();
      if (token) {
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

        try {
          const refreshResponse = await authService.refreshToken();

          const newAccessToken = refreshResponse.access_token;
          setToken(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null);
          return client(originalRequest);

        } catch (refreshError) {
          setToken(null);
          processQueue(refreshError as AxiosError);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
}


setupInterceptors(authApiClient);
setupInterceptors(userApiClient);


export { authApiClient, userApiClient };
