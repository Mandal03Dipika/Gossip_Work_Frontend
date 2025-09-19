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
}
