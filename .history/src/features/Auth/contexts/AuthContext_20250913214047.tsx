import React, { createContext, useContext, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { IAuthContext, IUser } from '@/types/AuthTypes'

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
    sock.on('forceLogout', () => {
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
    socket.emit('logout', {}, (response: any) => {
      if (response.success) {
        setAuthUser(null)
        disconnectSocket()
        localStorage.removeItem('token')
      } else {
        console.error(response.error || 'Logout failed')
      }
    })
  }

  const forgotPassword = async (
    email: string,
    callback?: (res: any) => void,
  ) => {
    const sock = io(BASE_URL, { auth: { event: 'forgotPassword' } })
    sock.emit('forgotPassword', { email }, (response: any) => {
      if (response.success) {
        if (callback) callback(response)
      } else {
        console.error(response.error || 'Failed to send reset OTP')
      }
      sock.disconnect()
    })
  }

  const verifyResetOtp = async (
    { email, otp }: { email: string; otp: string },
    callback?: (res: any) => void,
  ) => {
    const sock = io(BASE_URL, { auth: { event: 'verifyResetOtp' } })
    sock.emit('verifyResetOtp', { email, otp }, (response: any) => {
      if (response.success) {
        if (callback) callback(response)
      } else {
        console.error(response.error || 'Invalid or expired OTP')
      }
      sock.disconnect()
    })
  }

  const resetPassword = async (
    { email, newPassword }: { email: string; newPassword: string },
    callback?: (res: any) => void,
  ) => {
    const sock = io(BASE_URL, { auth: { event: 'resetPassword' } })
    sock.emit('resetPassword', { email, newPassword }, (response: any) => {
      if (response.success) {
        if (callback) callback(response)
      } else {
        console.error(response.error || 'Failed to reset password')
      }
      sock.disconnect()
    })
  }

  const resendOtp = async (email: string, callback?: (res: any) => void) => {
    const sock = io(BASE_URL, { auth: { event: 'resendOtp' } })
    sock.emit('resendOtp', { email }, (response: any) => {
      if (response.success) {
        if (callback) callback(response)
      } else {
        console.error(response.error || 'Failed to resend OTP')
      }
      sock.disconnect()
    })
  }

  const update = async (data: any) => {
    if (!socket) return
    const userId = authUser?._id
    setIsUpdatingProfile(true)
    socket.emit('update', { ...data, userId }, (response: any) => {
      if (response.success) {
        setAuthUser(response.user)
      } else {
        console.error(response.error || 'Profile update failed')
      }
      setIsUpdatingProfile(false)
    })
  }

  const getOnlineFriends = () => {
    if (!socket) return
    socket.emit('getOnlineFriends', {}, (response: any) => {
      if (response.success) {
        setOnlineFriends(response.friends)
      } else {
        console.error(response.error || 'Failed to fetch online friends')
      }
    })
  }

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isSigningUp,
        isLoggingIn,
        isUpdatingProfile,
        isCheckingAuth,
        onlineUsers,
        onlineFriends,

        connectSocket,
        disconnectSocket,
        register,
        verifyOtp,
        login,
        logout,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        resendOtp,
        update,
        getOnlineFriends,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
