import { createContext, useContext, useState } from 'react'
import { io } from 'socket.io-client'

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
export const AuthContextProvider = ({ children }: any) => {
  const [_socket, _setSocket] = useState(null)
  const [onlineUsers, _setOnlineUsers] = useState([])
  const [authUser, _setAuthUser] = useState(null)
  const BASE_URL = 'https://gossip.backend.wishalpha.com'
  const connectSocket = () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const socket = io(BASE_URL, {
      auth: { token },
    })
    socket.on('connect')
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
    set({ socket })
  }

  return (
    <AuthContext.Provider value={{ onlineUsers, authUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
