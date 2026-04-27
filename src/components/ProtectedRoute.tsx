import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  role?: string
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/admin" replace />
  if (role && user.role !== role) return <Navigate to="/admin" replace />
  return <>{children}</>
}
