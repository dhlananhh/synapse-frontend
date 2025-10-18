import React, { createContext, useContext } from 'react'
import { Community, CommunityFlair, CommunityRule } from '@/types/services/community'

type CommunityContextValue = {
  community: Community | null
  setCommunity: React.Dispatch<React.SetStateAction<Community | null>>
  flairs: CommunityFlair[]
  setFlairs: React.Dispatch<React.SetStateAction<CommunityFlair[]>>
  rules: CommunityRule[]
  setRules: React.Dispatch<React.SetStateAction<CommunityRule[]>>
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

export const useCommunityFlairs = () => {
  const ctx = useContext(CommunityContext)
  return ctx?.flairs ?? []
}

export const useCommunityRules = () => {
  const ctx = useContext(CommunityContext)
  return ctx?.rules ?? []
}

export const useSetCommunityFlairs = () => {
  const ctx = useContext(CommunityContext)
  if (!ctx) {
    throw new Error('useSetCommunityFlairs must be used within a CommunityContext.Provider')
  }
  return ctx.setFlairs
}

export const useSetCommunityRules = () => {
  const ctx = useContext(CommunityContext)
  if (!ctx) {
    throw new Error('useSetCommunityRules must be used within a CommunityContext.Provider')
  }
  return ctx.setRules
}
