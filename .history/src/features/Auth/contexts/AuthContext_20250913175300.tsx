import React, { createContext, useContext, useState } from 'react'
import type { IAuthContext, IUser } from '@/types/AuthTypes'
import { io } from 'socket.io-client'

const BASE_URL = 'https://gossip.backend.wishalpha.com'

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [socket, setSocket] = useState(null)
  const [onlineFriends, setOnlineFriends] = useState([])

  const connectSocket = () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const socket = io(BASE_URL, {
      auth: { token },
    })
    // socket.on('connect')
    socket.on('getOnlineUsers', (userIds) => {
      //   set({ onlineUsers: userIds })
      setOnlineUsers(userIds)
    })
    socket.on('forceLogout', (data) => {
      localStorage.removeItem('token')
      setAuthUser(null)
      //   get().disconnectSocket()
    })
    socket.on('connect_error', (err) => {
      if (err.message.includes('Authentication error')) {
        localStorage.removeItem('token')
        setAuthUser(null)
        // get().disconnectSocket()
      }
    })
    set({ socket })
  }

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isUpdatingProfile,
        isSigningUp,
        isLoggingIn,
        isCheckingAuth,
        onlineUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
