import { useAuth } from '../../context/AuthContext'
import { UserRound } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <main className="app-page page-shell narrow-content">
      <div className="page-title">
        <p className="eyebrow">your details</p>
        <h1>Profile</h1>
        <p className="muted">Your account details used for FreshFold orders.</p>
      </div>
      <section className="detail-panel profile-form">
        <span className="round-icon"><UserRound size={18} /></span>
        <label>Full name<input value={user?.fullName || user?.name || ''} readOnly /></label>
        <label>Email address<input value={user?.email || ''} readOnly /></label>
        <label>Phone number<input value={user?.phone || ''} readOnly /></label>
        <label>Default address<textarea value={user?.address || ''} rows="3" readOnly /></label>
        <p className="muted">Profile editing is not available in the current account API.</p>
      </section>
    </main>
  )
}
