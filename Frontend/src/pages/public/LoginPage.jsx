import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function LoginPage() {
	const [form, setForm] = useState({ email: '', password: '', role: 'customer' })
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const { login } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })

	async function submit(event) {
		event.preventDefault()
		setBusy(true)
		setError('')
		try {
			const user = await login(form)
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
				<span className="brand"><span className="brand-mark">F</span> folded<span className="brand-dot">.</span></span>
				<h1>Your laundry,<br /><em>off your mind.</em></h1>
				<p>Good clothes deserve good care. We make it easy to keep both.</p>
			</div>
			<form className="auth-card" onSubmit={submit}>
				<div className="auth-heading">
					<span className="round-icon"><LockKeyhole size={18} /></span>
					<p className="eyebrow">welcome back</p>
					<h2>Sign in to Folded</h2>
					<p className="muted">Pick up where you left off.</p>
				</div>
				{error && <ErrorMessage message={error} />}
				<label>Account type
					<select name="role" value={form.role} onChange={update}>
						<option value="customer">Customer</option>
						<option value="vendor">Vendor</option>
						<option value="admin">Admin</option>
					</select>
				</label>
				<label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
				<label>Password<input name="password" type="password" value={form.password} onChange={update} placeholder="Your password" required /></label>
				<button className="button button-dark full-button" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button>
				<p className="form-foot">New to Folded? <Link to="/register">Create an account</Link></p>
			</form>
		</main>
	)
}
