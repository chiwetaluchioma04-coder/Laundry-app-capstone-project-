import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { requestPasswordReset, resetPassword } from '../../api/authApi'
import Brand from '../../components/common/Brand'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams()
  const resetToken = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submitRequest(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { data } = await requestPasswordReset(email)
      setMessage(data.message)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not request a password reset.')
    } finally {
      setBusy(false)
    }
  }

  async function submitReset(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      const { data } = await resetPassword(resetToken, password)
      setMessage(data.message)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not reset your password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-aside">
        <Brand />
        <p className="eyebrow">account access</p>
        <h1>{resetToken ? <>Choose a<br /><em>new password.</em></> : <>Back to<br /><em>your account.</em></>}</h1>
        <p>We’ll help you get back to your FreshFold account securely.</p>
      </div>
      <form className="auth-card" onSubmit={resetToken ? submitReset : submitRequest}>
        <div className="auth-heading">
          <span className="round-icon"><LockKeyhole size={18} /></span>
          <p className="eyebrow">{resetToken ? 'set a new password' : 'password help'}</p>
          <h2>{resetToken ? 'Reset your password' : 'Forgot your password?'}</h2>
          <p className="muted">{resetToken ? 'Choose a new password for your account.' : 'Enter your account email and we’ll send you a reset link.'}</p>
        </div>
        {error && <ErrorMessage message={error} />}
        {message && <p className="success-message" role="status">{message}</p>}
        {resetToken ? (
          <>
            <label>New password<input name="password" type="password" autoComplete="new-password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
            <button className="button button-dark full-button" disabled={busy}>{busy ? 'Resetting...' : 'Reset password'} <ArrowRight size={17} /></button>
          </>
        ) : (
          <>
            <label>Email address<input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
            <button className="button button-dark full-button" disabled={busy}>{busy ? 'Sending...' : 'Send reset link'} <ArrowRight size={17} /></button>
          </>
        )}
        <p className="form-foot"><Link to="/login"><ArrowLeft size={15} /> Back to sign in</Link></p>
      </form>
    </main>
  )
}
