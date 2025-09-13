import { createContext, useState, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'

const BASE_URL = 'https://gossip.backend.wishalpha.com'

interface IUser {
  _id: string
  name: string
  email: string
}

interface IAuthContext {
  authUser: IUser | null
  isSigningUp: boolean
  isLoggingIn: boolean
  isUpdatingProfile: boolean
  isCheckingAuth: boolean
  onlineUsers: string[]
  onlineFriends: string[]
  socket: Socket
  connectSocket: () => void
  disconnectSocket: () => void
  checkAuth: () => Promise<void>
  register: (data: any, callback: any) => Promise<void>
  verifyOtp: (
    { email, otp }: { email: string; otp: string },
    onSuccess: any,
  ) => Promise<void>
  login: (data: any) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string, callback: any) => Promise<void>
  verifyResetOtp: (
    { email, otp }: { email: string; otp: string },
    callback?: () => void,
  ) => Promise<void>
  resendOtp: (email: string, callback?: () => void) => Promise<void>
  update: (data: any) => Promise<void>
  getOnlineFriends: () => void
}

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  const [onlineUsers, setOnlineUsers] = useState<Array<string>>([])
  const [onlineFriends, setOnlineFriends] = useState<Array<string>>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  // ---------- Socket Handlers ----------
  const connectSocket = () => {
    const token = localStorage.getItem('token')
    if (!token) return

    const sock = io(BASE_URL, { auth: { token } })

    sock.on('getOnlineUsers', (userIds: string[]) => setOnlineUsers(userIds))

    sock.on('forceLogout', (data: any) => {
      toast.error(data.message || 'You have been logged out.')
      localStorage.removeItem('token')
      setAuthUser(null)
      disconnectSocket()
    })

    sock.on('connect_error', (err: Error) => {
      if (err.message.includes('Authentication error')) {
        toast.error('Session expired. Logging out...')
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

  // ---------- Auth Functions ----------
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
        toast.error('Session expired. Please login again.')
        localStorage.removeItem('token')
        setAuthUser(null)
        disconnectSocket()
      }
      setIsCheckingAuth(false)
    })

    sock.on('getOnlineUsers', (userIds: string[]) => setOnlineUsers(userIds))
    sock.on('forceLogout', (data: any) => {
      toast.error(data.message || 'You have been logged out.')
      localStorage.removeItem('token')
      setAuthUser(null)
      disconnectSocket()
    })
    sock.on('connect_error', (err: Error) => {
      if (err.message.includes('Authentication error')) {
        toast.error('Session expired. Logging out...')
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
        toast.success('OTP sent to your email. Please verify.')
        if (callback) callback(response)
      } else {
        toast.error(response.error || 'Registration failed')
        if (callback) callback(response)
        sock.disconnect()
      }
      setIsSigningUp(false)
    })
  }

  const verifyOtp = async (
    { email, otp }: { email: string; otp: string },
    onSuccess?: () => void,
  ) => {
    setIsVerifyingOtp(true)
    const sock = io(BASE_URL, { auth: { event: 'verifyOtp' } })
    sock.emit('verifyOtp', { email, otp }, (response: any) => {
      if (response.success) {
        setAuthUser(response.user)
        localStorage.setItem('token', response.user.token)
        toast.success('Account verified successfully!')
        sock.disconnect()
        connectSocket()
        if (onSuccess) onSuccess()
      } else {
        toast.error(response.error || 'OTP verification failed')
        sock.disconnect()
      }
      setIsVerifyingOtp(false)
    })
  }

  const login = async (data: any) => {
    setIsLoggingIn(true)
    const sock = io(BASE_URL, { auth: { event: 'login' } })
    sock.emit('login', data, (response: any) => {
      if (response.success) {
        setAuthUser(response.user)
        localStorage.setItem('token', response.user.token)
        toast.success('Logged in Successfully')
        sock.disconnect()
        connectSocket()
      } else {
        toast.error(response.error || 'Login failed')
        sock.disconnect()
      }
      setIsLoggingIn(false)
    })
  }

  const logout = async () => {
    if (!socket) return
    socket.emit('logout', {}, (response: any) => {
      if (response.success) {
        setAuthUser(null)
        toast.success('Logged Out Successfully')
        disconnectSocket()
        localStorage.removeItem('token')
      } else {
        toast.error(response.error || 'Logout failed')
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
        toast.success('OTP sent to your email for password reset.')
        if (callback) callback(response)
      } else {
        toast.error(response.error || 'Failed to send reset OTP')
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
        toast.success('OTP verified! You can now reset your password.')
        if (callback) callback(response)
      } else {
        toast.error(response.error || 'Invalid or expired OTP')
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
        toast.success('Password reset successfully! Please login again.')
        if (callback) callback(response)
      } else {
        toast.error(response.error || 'Failed to reset password')
      }
      sock.disconnect()
    })
  }

  const resendOtp = async (email: string, callback?: (res: any) => void) => {
    const sock = io(BASE_URL, { auth: { event: 'resendOtp' } })
    sock.emit('resendOtp', { email }, (response: any) => {
      if (response.success) {
        toast.success('OTP resent to your email.')
        if (callback) callback(response)
      } else {
        toast.error(response.error || 'Failed to resend OTP')
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
        toast.success('Profile Updated Successfully')
      } else {
        toast.error(response.error || 'Profile update failed')
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
        toast.error(response.error || 'Failed to fetch online friends')
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
        socket,

        connectSocket,
        disconnectSocket,
        checkAuth,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
