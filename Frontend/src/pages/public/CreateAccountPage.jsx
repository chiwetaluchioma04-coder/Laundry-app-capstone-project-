import { ArrowRight, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'customer',
    businessName: '',
    businessAddress: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await register(form)
      navigate(user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/pricing' : '/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create your account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-aside register-aside">
        <span className="brand"><span className="brand-mark">F</span> folded<span className="brand-dot">.</span></span>
        <p className="eyebrow">a little more room in your day</p>
        <h1>Let’s make<br /><em>laundry lighter.</em></h1>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-heading">
          <span className="round-icon"><UserRoundPlus size={18} /></span>
          <p className="eyebrow">join folded</p>
          <h2>Create your account</h2>
          <p className="muted">Choose how you’ll use Folded.</p>
        </div>
        {error && <ErrorMessage message={error} />}
        <label>Account type
          <select name="role" value={form.role} onChange={update}>
            <option value="customer">Customer</option>
            <option value="vendor">Laundry vendor</option>
          </select>
        </label>
        <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your name" required /></label>
        <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
        <div className="field-row">
          <label>Phone<input name="phone" value={form.phone} onChange={update} placeholder="080..." /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={update} placeholder="6+ characters" minLength="6" required /></label>
        </div>
        {form.role === 'vendor' ? (
          <>
            <label>Business name<input name="businessName" value={form.businessName} onChange={update} placeholder="Your laundry business" required /></label>
            <label>Business address<textarea name="businessAddress" value={form.businessAddress} onChange={update} rows="2" placeholder="Where customers can find you" required /></label>
          </>
        ) : form.role === 'customer' ? (
          <label>Default pickup address<input name="address" value={form.address} onChange={update} placeholder="Where should we collect?" /></label>
        ) : null}
        <button className="button button-dark full-button" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'} <ArrowRight size={17} />
        </button>
        <p className="form-foot">Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </main>
  )
}