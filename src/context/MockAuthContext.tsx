"use client";

import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
  ReactNode
} from "react";
import { useTranslation } from "react-i18next";
import { User, Language, ViewMode } from "@/types";
import { RegisterFormSchema, TRegisterFormSchema } from "@/libs/validators/auth-validator";
import {
  TUserProfileSchema,
  TUpdateDisplayNameSchema
} from "@/libs/validators/user-validator";
import { allMockUsers } from "@/libs/mock-data";
import { toast } from "sonner";


type UserVote = "UP" | "DOWN";
type UserVotes = Record<string, UserVote>;

const HISTORY_STORAGE_KEY = "synapse-view-history";
const MAX_HISTORY_LENGTH = 50;
const VIEW_MODE_STORAGE_KEY = "synapse-view-mode";


interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  register: (data: any) => void;
  subscribedCommunityIds: string[];
  isSubscribed: (communityId: string) => boolean;
  subscribeToCommunity: (communityId: string) => void;
  unsubscribeFromCommunity: (communityId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (isOpen: boolean) => void;
  userVotes: UserVotes;
  getVoteStatus: (itemId: string) => UserVote | null;
  handleVote: (itemId: string, newVote: UserVote) => void;
  displayLanguage: string;
  contentLanguages: string[];
  setDisplayLanguage: (langCode: string) => void;
  setContentLanguages: (langCodes: string[]) => void;
  mutedCommunityIds: string[];
  isMuted: (communityId: string) => boolean;
  toggleMuteCommunity: (communityId: string) => void;
  blockedUserIds: string[];
  isBlocked: (userId: string) => boolean;
  toggleBlockUser: (userId: string) => void;
  savedPostIds: string[];
  isPostSaved: (postId: string) => boolean;
  toggleSavePost: (postId: string) => void;
  viewedPostIds: string[];
  logPostView: (postId: string) => void;
  clearHistory: () => void;
  followingUserIds: string[];
  isFollowing: (userId: string) => boolean;
  toggleFollowUser: (userId: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  const [ user, setCurrentUser ] = useState<User | null>(null);
  const [ subscribedCommunityIds, setSubscribedCommunityIds ] = useState<string[]>([]);
  const [ isOnboardingModalOpen, setIsOnboardingModalOpen ] = useState(false);
  const [ userVotes, setUserVotes ] = useState<UserVotes>({});
  const [ displayLanguage, setDisplayLanguage ] = useState<string>(i18n.language.split("-")[ 0 ]);
  const [ contentLanguages, setContentLanguages ] = useState<string[]>([ i18n.language.split("-")[ 0 ] ]);
  const [ mutedCommunityIds, setMutedCommunityIds ] = useState<string[]>([]);
  const [ blockedUserIds, setBlockedUserIds ] = useState<string[]>([]);
  const [ savedPostIds, setSavedPostIds ] = useState<string[]>([ "p2" ]);
  const [ viewedPostIds, setViewedPostIds ] = useState<string[]>([]);
  const [ followingUserIds, setFollowingUserIds ] = useState<string[]>([ "u1" ]);
  const [ viewMode, setViewModeInternal ] = useState<ViewMode>("card");


  useEffect(() => {
    const savedMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as ViewMode | null;
    if (savedMode && [ 'card', 'compact' ].includes(savedMode)) {
      setViewModeInternal(savedMode);
    }
  }, []);

  const setViewMode = (mode: ViewMode) => {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    setViewModeInternal(mode);
  };

  useEffect(() => {
    const currentLang = i18n.language.split("-")[ 0 ];
    if (displayLanguage !== currentLang) {
      i18n.changeLanguage(displayLanguage);
    }
  }, [ displayLanguage, i18n ]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setViewedPostIds(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to parse view history from localStorage:", error);
    }
  }, []);


  const login = (username: string) => {
    const userToLogin = allMockUsers.find(u => u.username === username);

    if (userToLogin) {
      setCurrentUser(userToLogin);
    } else {
      console.warn(`Login failed: User "${username}" not found in mock data.`);
      toast.error("Login Failed", { description: "Invalid username or password." });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (data: TRegisterFormSchema) => {
    const newUser: User = {
      id: `u_${Math.random().toString(36).substr(2, 9)}`,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      gender: data.gender,
      birthday: typeof data.birthday === "string" ? data.birthday : data.birthday.toISOString(),
      createdAt: new Date().toISOString(),
      karma: {
        post: 0,
        comment: 0,
      },
    };
    setCurrentUser(newUser);
    const hasCompletedOnboarding = localStorage.getItem("onboardingComplete");
    if (!hasCompletedOnboarding) {
      setIsOnboardingModalOpen(true);
    }
  };

  const isSubscribed = (communityId: string) => {
    return subscribedCommunityIds.includes(communityId);
  };

  const subscribeToCommunity = (communityId: string) => {
    setSubscribedCommunityIds(prev => [ ...prev, communityId ]);
  };

  const unsubscribeFromCommunity = (communityId: string) => {
    setSubscribedCommunityIds(prev => prev.filter(id => id !== communityId));
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        ...data,
      };
      setCurrentUser(updatedUser);
    }
  };

  const getVoteStatus = (itemId: string) => {
    return userVotes[ itemId ] || null;
  };

  const handleVote = (itemId: string, newVote: UserVote) => {
    setUserVotes(prevVotes => {
      const currentVote = prevVotes[ itemId ];
      const newVotes = { ...prevVotes };

      if (currentVote === newVote) {
        // User is clicking the same button again, so un-vote
        delete newVotes[ itemId ];
      } else {
        // Set the new vote
        newVotes[ itemId ] = newVote;
      }
      return newVotes;
    });
  };

  const isMuted = (communityId: string): boolean => {
    return mutedCommunityIds.includes(communityId);
  };

  const toggleMuteCommunity = (communityId: string) => {
    setMutedCommunityIds(prevMuted => {
      if (prevMuted.includes(communityId)) {
        // If already muted, unmute it
        return prevMuted.filter(id => id !== communityId);
      } else {
        // If not muted, mute it
        return [ ...prevMuted, communityId ];
      }
    });
  };

  const isBlocked = (userId: string): boolean => {
    return blockedUserIds.includes(userId);
  };

  const toggleBlockUser = (userId: string) => {
    setBlockedUserIds(prevBlocked => {
      if (prevBlocked.includes(userId)) {
        // If already blocked, unblock
        return prevBlocked.filter(id => id !== userId);
      } else {
        // If not blocked, block
        return [ ...prevBlocked, userId ];
      }
    });
  };

  const isPostSaved = (postId: string): boolean => {
    return savedPostIds.includes(postId);
  };

  const toggleSavePost = (postId: string) => {
    setSavedPostIds(prevSaved => {
      if (prevSaved.includes(postId)) {
        // If already saved, unsave it
        return prevSaved.filter(id => id !== postId);
      } else {
        // If not saved, save it
        return [ ...prevSaved, postId ];
      }
    });
  };

  const logPostView = useCallback((postId: string) => {
    setViewedPostIds(currentHistory => {
      // 1. Remove any existing instance of the postId to move it to the front.
      const newHistory = currentHistory.filter(id => id !== postId);
      // 2. Add the new postId to the beginning of the array.
      newHistory.unshift(postId);
      // 3. Trim the array to the maximum length.
      const trimmedHistory = newHistory.slice(0, MAX_HISTORY_LENGTH);

      // 4. Save the updated history to localStorage.
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
      return trimmedHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setViewedPostIds([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  const isFollowing = (userId: string): boolean => {
    return followingUserIds.includes(userId);
  };

  const toggleFollowUser = (userId: string) => {
    setFollowingUserIds(prevFollowing => {
      if (prevFollowing.includes(userId)) {
        // If already following, unfollow
        return prevFollowing.filter(id => id !== userId);
      } else {
        // If not following, follow
        return [ ...prevFollowing, userId ];
      }
    });
  };


  const value = {
    user,
    login,
    logout,
    register,
    subscribedCommunityIds,
    isSubscribed,
    subscribeToCommunity,
    unsubscribeFromCommunity,
    updateUserProfile,
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    userVotes,
    getVoteStatus,
    handleVote,
    displayLanguage,
    contentLanguages,
    setDisplayLanguage,
    setContentLanguages,
    mutedCommunityIds,
    isMuted,
    toggleMuteCommunity,
    blockedUserIds,
    isBlocked,
    toggleBlockUser,
    savedPostIds,
    isPostSaved,
    toggleSavePost,
    viewedPostIds,
    logPostView,
    clearHistory,
    followingUserIds,
    isFollowing,
    toggleFollowUser,
    viewMode,
    setViewMode,
  };


  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  )
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
