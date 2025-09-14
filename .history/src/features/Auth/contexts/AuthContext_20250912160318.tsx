import { createContext, useContext, useState, type ReactNode } from 'react'
import { Socket, io } from 'socket.io-client'

const AuthContext = createContext({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  onlineFriends: [],

  isVerifyingOtp: false,
})
// Socket,authuser,onlineusers
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [_socket, _setSocket] = useState<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [authUser, setAuthUser] = useState(null)
  const [isCheckingAuth, setCheckingAuth] = useState(true)
  const BASE_URL = 'https://gossip.backend.wishalpha.com'
  const connectSocket = () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const socket = io(BASE_URL, {
      auth: { token },
    })
    // socket.on('connect')
    socket.on('getOnlineUsers', (userIds: []) => {
      // set({ onlineUsers: userIds })
      setOnlineUsers(userIds)
    })
    socket.on('forceLogout', (data) => {
      localStorage.removeItem('token')
      setAuthUser(null)
      disconnectSocket()
    })
    socket.on('connect_error', (err) => {
      if (err.message.includes('Authentication error')) {
        localStorage.removeItem('token')
        setAuthUser(null)
        disconnectSocket()
      }
    })
    _setSocket(socket)
  }

  const disconnectSocket = () => {
    if (_socket?.connected) {
      _socket.disconnect()
      setOnlineUsers([])
      _setSocket(null)
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      // set({ authUser: null, isCheckingAuth: false })
      setAuthUser(null)
      setCheckingAuth(false)
      return
    }
    const socket = io(BASE_URL, { auth: { token } })
    socket.connect()
    set({ socket })
    socket.emit('checkAuth', null, (response) => {
      if (response.success) {
        set({ authUser: response.user })
      } else {
        toast.error('Session expired. Please login again.')
        localStorage.removeItem('token')
        set({ authUser: null })
        get().disconnectSocket()
      }
      set({ isCheckingAuth: false })
    })
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })
    socket.on('forceLogout', (data) => {
      toast.error(data.message || 'You have been logged out.')
      localStorage.removeItem('token')
      set({ authUser: null })
      get().disconnectSocket()
    })
    socket.on('connect_error', (err) => {
      if (err.message.includes('Authentication error')) {
        toast.error('Session expired. Logging out...')
        localStorage.removeItem('token')
        set({ authUser: null })
        get().disconnectSocket()
      }
    })
  }

  return (
    <AuthContext.Provider value={{ onlineUsers, authUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
