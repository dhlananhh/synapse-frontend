import React, { createContext, useContext } from 'react'
import { Community } from '@/types/services/community'

type CommunityContextValue = {
  community: Community | null
  setCommunity: React.Dispatch<React.SetStateAction<Community | null>>
}

export const CommunityContext = createContext<CommunityContextValue | null>(null)

// backwards-friendly hook: returns the current community (same shape as before)
export const useCommunity = () => {
  const ctx = useContext(CommunityContext)
  return ctx?.community ?? null
}

// new hook to get the setter
export const useSetCommunity = () => {
  const ctx = useContext(CommunityContext)
  if (!ctx) {
    throw new Error('useSetCommunity must be used within a CommunityContext.Provider')
  }
  return ctx.setCommunity
}
