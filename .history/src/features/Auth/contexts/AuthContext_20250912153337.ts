import { createContext, useContext } from 'react'

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
    const 
  
    return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
  
};

export const useAuthContext = () => useContext(AuthContext);