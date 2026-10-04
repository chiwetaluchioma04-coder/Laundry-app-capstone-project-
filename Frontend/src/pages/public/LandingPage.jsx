import { ArrowRight, Check, Clock3, Shirt, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getServices } from '../../api/serviceApi'
import heroImage from '../../assets/hero.png'

export default function LandingPage() {
  const [services, setServices] = useState([])

  useEffect(() => { getServices().then(({ data }) => setServices(data.data.services)).catch(() => {}) }, [])

  return <main>
    <section className="hero page-shell">
      <div className="hero-copy"><p className="eyebrow">
      <span className="eyebrow-line" /> laundry, made lighter</p><h1>More time for living. <em>Less time at the sink.</em>
      </h1><p className="hero-lede">Fresh Fold picks up your laundry, cleans it beautifully, and brings it back when you need it. Your week just got a little roomier.</p>
      <div className="hero-actions"><Link className="button button-dark" to="/register">Schedule a pickup <ArrowRight size={17} /></Link>
      <Link className="quiet-link" to="/about">See how it works <ArrowRight size={15} /></Link></div></div>
      <div className="hero-art"><img src={heroImage} alt="A man carrying a basket of folded laundry" width="512" height="512" /></div></section>
    <section className="ticker"><span>NO MORE LAUNDRY DAYS</span>
    <span>•</span><span>LOCAL CARE, ON YOUR SCHEDULE</span>
    <span>•</span><span>NO MORE LAUNDRY DAYS</span>
    </section>
    <section className="page-shell intro-grid">
      <div>
        <p className="eyebrow">the Fresh Fold way</p>
        <h2>Careful with your clothes.<br /><em>Careful with your time.</em></h2></div>
        <div className="intro-copy"><p>We believe laundry should disappear into the background of your life. Tell us where and when, then get back to the things that matter.</p><Link className="text-link" to="/about">A better laundry routine <ArrowRight size={15} /></Link></div></section>
    <section className="service-band page-shell">
      <div className="section-heading"><div>
      <p className="eyebrow">popular services</p>
      <h2>Clean, pressed, ready.</h2></div><Link className="text-link" to="/register">View all services <ArrowRight size={15} /></Link></div><div className="service-grid">{services.length ? services.slice(0, 3).map((service, index) => <div className="service-tile" key={service._id}><span className="service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description || 'Thoughtful care for your everyday wardrobe.'}</p><strong>From ₦{Number(service.price).toLocaleString()}</strong></div>) : ['Wash & fold', 'Press & finish', 'Delicates'].map((name, index) => <div className="service-tile" key={name}><span className="service-number">0{index + 1}</span><h3>{name}</h3><p>Thoughtful care for your everyday wardrobe.</p><strong>Made to order</strong></div>)}</div></section>
    <section className="promise page-shell"><div className="promise-icon"><Sparkles /></div><div><p className="eyebrow">the little promise</p><h2>We treat every piece like it’s your favorite.</h2></div><ul><li><Check size={16} /> Easy pickup windows</li><li><Check size={16} /> Clear, upfront pricing</li><li><Check size={16} /> Care you can feel</li></ul></section>
  </main>
}
