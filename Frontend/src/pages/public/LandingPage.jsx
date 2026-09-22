import { ArrowRight, Check, Clock3, ShieldCheck, Shirt, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getServices } from '../../api/serviceApi'
import { useAuth } from '../../context/AuthContext'

export default function LandingPage() {
  const [services, setServices] = useState([])
  const [adminForm, setAdminForm] = useState({ email: '', password: '' })
  const [adminError, setAdminError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { getServices().then(({ data }) => setServices(data.data.services)).catch(() => {}) }, [])

  const updateAdminForm = (e) => setAdminForm((current) => ({ ...current, [e.target.name]: e.target.value }))

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setBusy(true)
    setAdminError('')

    try {
      const user = await login(adminForm)
      if (user.role !== 'admin') {
        throw new Error('This account does not have admin access.')
      }
      navigate('/admin')
    } catch (err) {
      setAdminError(err.response?.data?.message || err.message || 'Admin sign in failed.')
    } finally {
      setBusy(false)
    }
  }

  return <main>
    <section className="hero page-shell"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> laundry, made lighter</p><h1>More time for living. <em>Less time at the sink.</em></h1><p className="hero-lede">Folded picks up your laundry, cleans it beautifully, and brings it back when you need it. Your week just got a little roomier.</p><div className="hero-actions"><Link className="button button-dark" to="/register">Schedule a pickup <ArrowRight size={17} /></Link><Link className="quiet-link" to="/about">See how it works <ArrowRight size={15} /></Link></div><div className="admin-login-panel"><p className="eyebrow"><ShieldCheck size={14} /> admin access</p><form onSubmit={handleAdminLogin}><label>Admin email<input name="email" type="email" value={adminForm.email} onChange={updateAdminForm} placeholder="admin@folded.com" required /></label><label>Password<input name="password" type="password" value={adminForm.password} onChange={updateAdminForm} placeholder="Your admin password" required /></label>{adminError && <p className="error-message admin-error">{adminError}</p>}<button className="button button-yellow full-button" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Admin login'}</button></form></div></div><div className="hero-art"><div className="sun-stamp">fresh<br /><strong>every<br />time</strong></div><div className="hero-cloth cloth-yellow" /><div className="hero-cloth cloth-blue" /><div className="hero-label">pickup<br /><strong>today</strong></div></div></section>
    <section className="ticker"><span>NO MORE LAUNDRY DAYS</span><span>•</span><span>LOCAL CARE, ON YOUR SCHEDULE</span><span>•</span><span>NO MORE LAUNDRY DAYS</span></section>
    <section className="page-shell intro-grid"><div><p className="eyebrow">the folded way</p><h2>Careful with your clothes.<br /><em>Careful with your time.</em></h2></div><div className="intro-copy"><p>We believe laundry should disappear into the background of your life. Tell us where and when, then get back to the things that matter.</p><Link className="text-link" to="/about">A better laundry routine <ArrowRight size={15} /></Link></div></section>
    <section className="service-band page-shell"><div className="section-heading"><div><p className="eyebrow">popular services</p><h2>Clean, pressed, ready.</h2></div><Link className="text-link" to="/register">View all services <ArrowRight size={15} /></Link></div><div className="service-grid">{services.length ? services.slice(0, 3).map((service, index) => <div className="service-tile" key={service._id}><span className="service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description || 'Thoughtful care for your everyday wardrobe.'}</p><strong>From ₦{Number(service.price).toLocaleString()}</strong></div>) : ['Wash & fold', 'Press & finish', 'Delicates'].map((name, index) => <div className="service-tile" key={name}><span className="service-number">0{index + 1}</span><h3>{name}</h3><p>Thoughtful care for your everyday wardrobe.</p><strong>Made to order</strong></div>)}</div></section>
    <section className="promise page-shell"><div className="promise-icon"><Sparkles /></div><div><p className="eyebrow">the little promise</p><h2>We treat every piece like it’s your favorite.</h2></div><ul><li><Check size={16} /> Easy pickup windows</li><li><Check size={16} /> Clear, upfront pricing</li><li><Check size={16} /> Care you can feel</li></ul></section>
  </main>
}
