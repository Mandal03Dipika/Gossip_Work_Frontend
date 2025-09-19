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
  onlineUsers: Array<IUser>
  onlineFriends: Array<IUser>
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
}
