import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const ROLES = { BUYER: 'BUYER', SELLER: 'SELLER', INSPECTOR: 'INSPECTOR', ADMIN: 'ADMIN' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (stored && token) {
        setUser(JSON.parse(stored))
      }
    } catch {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (updates) => {
    const next = { ...user, ...updates }
    localStorage.setItem('user', JSON.stringify(next))
    setUser(next)
  }

  const hasRole = (role) => user?.roles?.includes(role) ?? false
  const isBuyer = () => hasRole(ROLES.BUYER)
  const isSeller = () => hasRole(ROLES.SELLER)
  const isInspector = () => hasRole(ROLES.INSPECTOR)
  const isAdmin = () => hasRole(ROLES.ADMIN)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        ROLES,
        hasRole,
        isBuyer,
        isSeller,
        isInspector,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
