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
        setAuthUser(response.user)
      } else {
        localStorage.removeItem('token')
        setAuthUser(null)
        disconnectSocket()
      }
      setIsCheckingAuth(false)
    })

    sock.on('getOnlineUsers', (userIds: []) => setOnlineUsers(userIds))
    sock.on('forceLogout', (data: any) => {
      localStorage.removeItem('token')
      setAuthUser(null)
      disconnectSocket()
    })
    sock.on('connect_error', (err: Error) => {
      if (err.message.includes('Authentication error')) {
        localStorage.removeItem('token')
        setAuthUser(null)
        disconnectSocket()
      }
    })
  }

  const register = async (data: any, callback?: (res: any) => void) => {
    setIsSigningUp(true)
    const sock = io(BASE_URL, { auth: { event: 'register' } })
    sock.emit('register', data, (response: any) => {
      if (response.success) {
        if (callback) callback(response)
      } else {
        if (callback) callback(response)
        sock.disconnect()
      }
      setIsSigningUp(false)
    })
  }

  const verifyOtp = async (
    { email, otp }: { email: string; otp: string },
    onSuccess: any,
  ) => {
    setIsVerifyingOtp(true)
    const sock = io(BASE_URL, { auth: { event: 'verifyOtp' } })
    sock.emit('verifyOtp', { email, otp }, (response) => {
      if (response.success) {
        setAuthUser(response.user)
        localStorage.setItem('token', response.user.token)
        disconnectSocket()
        connectSocket()
        if (onSuccess) onSuccess()
      } else {
        disconnectSocket()
      }
      setIsVerifyingOtp(false)
    })
  }

  const login = async (data: any) => {
    setIsLoggingIn(true)
    const sock = io(BASE_URL, {
      auth: {
        event: 'login',
      },
    })
    sock.emit('login', data, (response: any) => {
      if (response.success) {
        setAuthUser(response.user)
        localStorage.setItem('token', response.user.token)
        disconnectSocket()
        connectSocket()
      } else {
        disconnectSocket()
      }
      setIsLoggingIn(false)
    })
  }

  const logout = async () => {
    if (!socket) return
    socket.emit('logout', {}, (response) => {
      if (response.success) {
        set({ authUser: null })
        toast.success('Logged Out Successfully')
        get().disconnectSocket()
        localStorage.removeItem('token')
      } else {
        toast.error(response.error || 'Logout failed')
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
