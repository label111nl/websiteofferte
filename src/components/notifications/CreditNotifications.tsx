import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { notifications } from '@/lib/notifications'
import type { UserWithRole } from '@/types'
import { useUserCredits } from '@/hooks/useUserCredits'

export function CreditNotifications() {
  const { user } = useAuthStore()
  const credits = useUserCredits(user?.id)

  useEffect(() => {
    if (credits < 5) {
      notifications.warning.lowCredits()
    }
  }, [credits])

  return null
} 