import { createContext, useState } from 'react'
import type { IAuthContext, IUser } from '@/types/AuthTypes'

const BASE_URL = 'https://gossip.backend.wishalpha.com'

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null)

  return <AuthContext.Provider></AuthContext.Provider>
}
