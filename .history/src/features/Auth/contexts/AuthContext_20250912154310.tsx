import { createContext, useContext, useState } from 'react'

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
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [authUser, setAuthUser] = useState(null)

  const connectSocket = () => {}

  return (
    <AuthContext.Provider value={{ onlineUsers, authUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
