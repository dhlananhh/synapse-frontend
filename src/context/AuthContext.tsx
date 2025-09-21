"use client";


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import { authService } from "@/modules/services/auth-service";
import { userService } from "@/modules/services/user-service";
import { LoginPayload } from "@/types/services/auth";
import { UserProfile } from "@/types/services/user";
import { toast } from "sonner";


interface AuthContextType {
  user: UserProfile | null;
  followingIds: Set<string>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  updateFollowing: (targetUserId: string, action: "follow" | "unfollow") => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<UserProfile | null>(null);
  const [ followingIds, setFollowingIds ] = useState<Set<string>>(new Set());
  const [ isLoading, setIsLoading ] = useState(true);

  const fetchUserAndFollowing = useCallback(async (userId: string) => {
    try {
      const [ userProfile, followingList ] = await Promise.all([
        userService.getUserProfile(userId),
        userService.getFollowing(userId, 1, 100)
      ]);

      setUser(userProfile);

      const newFollowingIds = new Set(followingList.map(item => item.following.id));
      setFollowingIds(newFollowingIds);
      return userProfile;

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
      setFollowingIds(new Set());
      return null;
    }
  }, []);


  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const refreshResponse = await authService.refreshToken();
        if (refreshResponse && refreshResponse.user) {
          await fetchUserAndFollowing(refreshResponse.user.id);
        }
      } catch (error) {
        console.log("No active session found.");
        setUser(null);
        setFollowingIds(new Set());
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, [ fetchUserAndFollowing ]);

  const login = async (payload: LoginPayload) => {
    const loginResponse = await authService.login(payload);
    if (loginResponse && loginResponse.user) {
      await fetchUserAndFollowing(loginResponse.user.id);
      toast.success("Welcome back!");
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setFollowingIds(new Set());
    toast.info("You have been logged out.");
    window.location.href = "/login";
  };

  const updateFollowing = (targetUserId: string, action: "follow" | "unfollow") => {
    setFollowingIds(prev => {
      const newSet = new Set(prev);
      if (action === "follow") {
        newSet.add(targetUserId);
      } else {
        newSet.delete(targetUserId);
      }
      return newSet;
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    followingIds,
    updateFollowing
  }

  return (
    <AuthContext.Provider
      value={ value }
    >
      { !isLoading && children }
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
