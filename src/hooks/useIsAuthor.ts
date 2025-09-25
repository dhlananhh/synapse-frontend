import { useAuth } from "@/context/MockAuthContext";

export const useIsAuthor = (authorId: string): boolean => {
  const { user } = useAuth();
  if (!user || !authorId) {
    return false;
  }
  return user.id === authorId;
};
