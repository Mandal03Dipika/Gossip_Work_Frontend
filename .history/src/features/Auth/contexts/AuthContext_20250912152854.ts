import { createContext } from 'react'

const AuthContext = createContext({
  user: null,
  token: '',
  setUser: () => {},
  setToken: () => {},
})
