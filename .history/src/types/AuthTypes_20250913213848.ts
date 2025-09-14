import type { Socket } from 'socket.io-client'

export interface IUser {
  _id: string
  name: string
  email: string
}

export interface IAuthContext {
  authUser: IUser | null
  isSigningUp: boolean
  isLoggingIn: boolean
  isUpdatingProfile: boolean
  isCheckingAuth: boolean
  onlineUsers: Array<IUser>
  onlineFriends: Array<IUser>
  connectSocket: () => void
  disconnectSocket: () => void
  resetPassword: () => void
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
