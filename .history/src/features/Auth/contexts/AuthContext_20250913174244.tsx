import { createContext, useState } from 'react'
import type { IAuthContext, IUser } from '@/types/AuthTypes'

const BASE_URL = 'https://gossip.backend.wishalpha.com'

const AuthContext = createContext<IAuthContext | null>(null)


  onlineFriends: [],
  socket: null,
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [socket, setSocket] = useState(null)
  return <AuthContext.Provider value={{authUser,isUpdatingProfile, isSigningUp,isLoggingIn, isCheckingAuth, onlineUsers}}>
    {children}
  </AuthContext.Provider>
}
