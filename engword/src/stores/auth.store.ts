import { create } from 'zustand'
import type { AuthUser } from '@/auth/types'

interface AuthStore {
  user: AuthUser | null
  isLoggedIn: boolean
  setUser: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: user !== null }),
}))
