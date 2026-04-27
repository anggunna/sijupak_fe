import { createContext, useContext, useState, ReactNode } from 'react'
import api from '@/lib/axios'

interface AuthUser {
  nama: string
  email: string
  role: string
  token: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<string>
  register: (nama: string, email: string, password: string, role?: string) => Promise<string>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { access_token, role, nama } = res.data
    const authUser: AuthUser = { email, nama, role, token: access_token }
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('auth_user', JSON.stringify(authUser))
    setUser(authUser)
    return role as string
  }

  const register = async (nama: string, email: string, password: string, role = 'user') => {
    await api.post('/auth/register', { nama, email, password, role })
    return await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
