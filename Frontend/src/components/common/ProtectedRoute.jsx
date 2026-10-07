import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingSpinner label="Checking your account" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (role && user.role !== role) {
    const destination = user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/pricing' : '/dashboard'
    return <Navigate to={destination} replace />
  }
  return <Outlet />
}
