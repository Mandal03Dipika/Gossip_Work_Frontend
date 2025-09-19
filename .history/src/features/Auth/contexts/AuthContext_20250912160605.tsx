import { c } from 'node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf'
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
    _setSocket(socket)
    socket.emit('checkAuth', null, (response: any) => {
      if (response.success) {
        setAuthUser(response.user)
        connectSocket()
      } else {
        localStorage.removeItem('token')
        setAuthUser(null)
        disconnectSocket
      }
      setCheckingAuth(false)
    })
    socket.on('getOnlineUsers', (userIds: []) => {
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
  }

  return (
    <AuthContext.Provider value={{ onlineUsers, authUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
