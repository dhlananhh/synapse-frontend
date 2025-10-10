// MembershipContext.tsx
import React, { createContext, useContext } from "react";
import { CommunityMembership } from "@/types/services/community";

interface MembershipContextValue {
  membership: CommunityMembership | null;
  setMembership: (
    membership: CommunityMembership | null
  ) => void;
}

export const MembershipContext = createContext<
  MembershipContextValue | undefined
>(undefined);
export const useMembership = () =>
  useContext(MembershipContext);
