import { AuthContext } from '@/contexts/auth-context'
import { useContext } from 'react'

export function useAuth() {
  const contextValue = useContext(AuthContext)

  if (!contextValue) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return contextValue
}
