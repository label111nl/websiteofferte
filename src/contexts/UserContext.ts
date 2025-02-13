import { createContext, useContext } from 'react'
import type { UserWithRole } from '@/lib/auth'

export const UserContext = createContext<{
  user: UserWithRole | null;
  setUser: (user: UserWithRole | null) => void;
}>({
  user: null,
  setUser: () => {},
})

export const useUser = () => useContext(UserContext) 