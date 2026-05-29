'use client'

import { useEffect } from 'react'
import { syncQueue } from '@/sync/sync-queue'
import { useAuthStore } from '@/stores/auth.store'

/** 앱 포커스 복귀 시 sync flush 트리거 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) syncQueue.flush()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isLoggedIn])

  return <>{children}</>
}
