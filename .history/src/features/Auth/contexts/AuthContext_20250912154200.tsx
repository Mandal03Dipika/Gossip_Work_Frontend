import { createContext, useContext, useState } from 'react'

const AuthContext = createContext({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  onlineFriends: [],
  socket: null,
  isVerifyingOtp: false,
  connectSocket: 
})
// Socket,authuser,onlineusers
export const AuthContextProvider = ({ children }: any) => {
  const [socket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [authUser, setAuthUser] = useState(null)

  return (
    <AuthContext.Provider value={{ socket, onlineUsers, authUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
