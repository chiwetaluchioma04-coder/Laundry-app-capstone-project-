import { createContext, useContext, useEffect, useState } from 'react'
import { getProfile, loginUser, registerUser } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('folded_token'))
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) return
    getProfile()
      .then(({ data }) => setUser(data.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [token])

  async function login(payload) {
    const { data } = await loginUser(payload)
    localStorage.setItem('folded_token', data.data.token)
    setToken(data.data.token)
    setUser(data.data.user)
    return data.data.user
  }

  async function register(payload) {
    const { data } = await registerUser(payload)
    localStorage.setItem('folded_token', data.data.token)
    setToken(data.data.token)
    setUser(data.data.user)
    return data.data.user
  }

  function logout() {
    localStorage.removeItem('folded_token')
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
