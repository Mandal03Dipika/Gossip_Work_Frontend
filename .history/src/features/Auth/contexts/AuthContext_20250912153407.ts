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
})
// Socket,authuser  
export const AuthContextProvider = ({ children }) => {
    const [socket] = useState(null);
  
    return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
  
};

export const useAuthContext = () => useContext(AuthContext);