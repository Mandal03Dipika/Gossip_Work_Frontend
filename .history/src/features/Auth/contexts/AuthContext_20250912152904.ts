import { createContext } from 'react'

const AuthContext = createContext({
  authuser: null,
  token: '',
  setUser: () => {},
  setToken: () => {},
})
