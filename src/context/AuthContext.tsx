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
import { register } from "module";
import { setToken } from "@/libs/tokenManager";


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
      try {
        const { access_token, user: refreshedAuthUser } = await authService.refreshToken();
        setToken(access_token);

        if (refreshedAuthUser?.id) {
          const userProfile = await userService.getUserProfile(refreshedAuthUser.id);
          setUser({ ...userProfile, ...refreshedAuthUser });
        } else { throw new Error("Invalid session"); }
      } catch (error) {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (credentials: LoginPayload) => {
    const response = await authService.login(credentials);
    setToken(response.access_token);
    const userProfile = await userService.getUserProfile(response.user.id);
    setUser({ ...userProfile, ...response.user });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    }
    finally {
      setToken(null);
      setUser(null);
      window.location.href = "/login";
    }
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
