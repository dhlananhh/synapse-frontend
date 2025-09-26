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



interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<AuthUser | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);


  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const getMeUser = await authService.getMe(); // backend validates cookie/session
        console.log('get me user', getMeUser)
        setUser(getMeUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    cookieManager.setAccessToken(response.accessToken);
    const user = response.user
    setUser(user);
    console.log('auth context user', user)
  };

  const logout = async () => {
    await authService.logout();
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
