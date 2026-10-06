import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  return (
    <main className="app-page page-shell narrow-content">
      <section className="detail-panel profile-form">
        <span className="round-icon"><LockKeyhole size={18} /></span>
        <p className="eyebrow">account access</p>
        <h1>Password reset is unavailable</h1>
        <p className="muted">The current FreshFold API does not support password-reset requests. Contact the FreshFold administrator for help accessing your account.</p>
        <Link className="back-link" to="/login"><ArrowLeft size={15} /> Back to sign in</Link>
      </section>
    </main>
  )
}
