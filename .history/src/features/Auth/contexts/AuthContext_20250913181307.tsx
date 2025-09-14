import React, { createContext, useContext, useState } from 'react'
import type { IAuthContext, IUser } from '@/types/AuthTypes'
import { io, Socket } from 'socket.io-client'

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
  const [onlineUsers, setOnlineUsers] = useState<[]>([])
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [onlineFriends, setOnlineFriends] = useState<[]>([])

  const connectSocket = () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const sock = io(BASE_URL, {
      auth: { token },
    })
    sock.on('getOnlineUsers', (userIds) => {
      setOnlineUsers(userIds)
    })
    sock.on('forceLogout', (data) => {
      localStorage.removeItem('token')
      setAuthUser(null)
      disconnectSocket()
    })
    sock.on('connect_error', (err) => {
      if (err.message.includes('Authentication error')) {
        localStorage.removeItem('token')
        setAuthUser(null)
        disconnectSocket()
      }
    })
    setSocket(sock)
  }

  const disconnectSocket = () => {
    if (socket?.connected) {
      socket.disconnect()
      setSocket(null)
      setOnlineUsers([])
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setAuthUser(null)
      setIsCheckingAuth(false)
      return
    }
    const sock = io(BASE_URL, { auth: { token } })
    sock.connect()
    setSocket(sock)
    sock.emit('checkAuth', null, (response: any) => {
      if (response.success) {
        // set({ authUser: response.user })
        setAuthUser(response.user)
      } else {
        localStorage.removeItem('token')
        setAuthUser(null)
        disconnectSocket()
      }
      setIsCheckingAuth(false)
    })
    sock.on('getOnlineUsers', (userIds) => {
      setOnlineUsers(userIds)
    })
    sock.on('forceLogout', (data) => {
      localStorage.removeItem('token')
      setAuthUser(null)
      disconnectSocket()
    sock.on('connect_error', (err) => {
      if (err.message.includes('Authentication error')) {
        localStorage.removeItem('token')
        setAuthUser(null);
        disconnectSocket()
      }
    })
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
