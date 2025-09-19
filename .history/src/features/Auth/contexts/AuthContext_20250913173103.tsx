import { createContext, useState } from 'react'
import type { IAuthContext, IUser } from '@/types/AuthTypes'

const BASE_URL = 'https://gossip.backend.wishalpha.com'

const AuthContext = createContext<IAuthContext | null>(null)


  isCheckingAuth: true,
  onlineUsers: [],
  onlineFriends: [],
  socket: null,

  isVerifyingOtp: false,

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  return <AuthContext.Provider value={authUser,isUpdatingProfile, isSigningUp,isLoggingIn, isCheckingAuth, onlineUsers,}></AuthContext.Provider>
}
