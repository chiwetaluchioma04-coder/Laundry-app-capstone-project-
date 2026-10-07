import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'
import Brand from '../../components/common/Brand'

export default function LoginPage({ adminOnly = false }) {
	const [form, setForm] = useState({ email: '', password: '' })
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const { login, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })

	async function submit(event) {
		event.preventDefault()
		setBusy(true)
		setError('')
		try {
			const user = await login(adminOnly ? { ...form, role: 'admin' } : form)
			if (adminOnly && user.role !== 'admin') {
				logout()
				setError('This account does not have administrator access.')
				return
			}
			const destination = user.role === 'admin'
				? '/admin'
				: user.role === 'vendor'
					? '/vendor/pricing'
					: location.state?.from?.pathname || '/dashboard'
			navigate(destination)
		} catch (requestError) {
			setError(requestError.response?.data?.message || 'Could not sign you in.')
		} finally {
			setBusy(false)
		}
	}

	return (
		<main className="auth-page">
			<div className="auth-aside">
				<Brand />
				<h1>Your laundry,<br /><em>off your mind.</em></h1>
				<p>Good clothes deserve good care. We make it easy to keep both.</p>
			</div>
			<form className="auth-card" onSubmit={submit}>
				<div className="auth-heading">
					<span className="round-icon"><LockKeyhole size={18} /></span>
					<p className="eyebrow">{adminOnly ? 'administrator access' : 'welcome back'}</p>
					<h2>{adminOnly ? 'Admin sign in' : 'Sign in to FreshFold'}</h2>
					<p className="muted">{adminOnly ? 'Sign in with an administrator account.' : 'Pick up where you left off.'}</p>
				</div>
				{error && <ErrorMessage message={error} />}
				<label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
				<label>Password<input name="password" type="password" value={form.password} onChange={update} placeholder="Your password" required /></label>
				<div style={{ textAlign: 'right', marginBottom: '1rem' }}>
					<Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>Forgot password?</Link>
				</div>
				<button className="button button-dark full-button" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button>
				{adminOnly
					? <p className="form-foot">Customer or vendor? <Link to="/login">Use regular sign in</Link></p>
					: <p className="form-foot">New to FreshFold? <Link to="/register">Create an account</Link></p>}
			</form>
		</main>
	)
}
