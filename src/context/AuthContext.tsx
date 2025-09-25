"use client";


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import {
  AuthUser,
  LoginPayload,
  RegisterPayload
} from "@/types/services/auth";
import { UserProfile } from "@/types/services/user";
import { authService } from "@/modules/services/auth-service";
import { userService } from "@/modules/services/user-service";
import { cookieManager } from "@/libs/cookieManager";


type CurrentUser = AuthUser & UserProfile;


interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<CurrentUser | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const refreshToken = cookieManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await authService.refreshToken(refreshToken);
          cookieManager.setAccessToken(response.accessToken);
          if (response.refreshToken)
            cookieManager.setRefreshToken(response.refreshToken);

          const userProfile = await userService.getUserProfile(response.user.id);
          setUser({ ...userProfile, ...response.user });
        } catch (error) {
          cookieManager.removeAccessToken();
          cookieManager.removeRefreshToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkUserSession();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    cookieManager.setAccessToken(response.accessToken);
    const userProfile = await userService.getUserProfile(response.user.id);
    setUser({ ...userProfile, ...response.user });
  };

  const logout = async () => {
    cookieManager.removeAccessToken();
    cookieManager.removeRefreshToken();
    setUser(null);
    window.location.href = "/login";
  };

  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider
      value={ value }
    >
      { children }
    </AuthContext.Provider>
  )
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
