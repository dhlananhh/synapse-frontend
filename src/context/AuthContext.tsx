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
  LoginPayload
} from "@/types/services/auth";
import { UserProfile } from "@/types/services/user";
import { authService } from "@/modules/services/auth-service";
import { userService } from "@/modules/services/user-service";


type CurrentUser = AuthUser & UserProfile;


interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  // You can add register function if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<CurrentUser | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userProfile = await userService.getMe();

        const authInfo: AuthUser = {
          id: userProfile.accountId,
          email: "user@email.com",
          role: "USER"
        };

        setUser({ ...userProfile, ...authInfo });

      } catch (error) {
        console.log("No active session found.");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (credentials: LoginPayload) => {
    const { user: authUser } = await authService.login(credentials);
    const userProfile = await userService.getUserProfile(authUser.id);
    setUser({ ...userProfile, ...authUser });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
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
