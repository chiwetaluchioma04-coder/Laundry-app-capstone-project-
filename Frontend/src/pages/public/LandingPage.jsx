import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/hero.png'

const services = [
  { name: 'Wash & fold', description: 'Everyday washing and careful folding.' },
  { name: 'Wash, iron & fold', description: 'Washed, pressed and ready to wear.' },
  { name: 'Dry cleaning', description: 'Specialist care for delicate garments.' },
]

export default function LandingPage() {
  return <main>
    <section className="hero page-shell">
      <div className="hero-copy"><p className="eyebrow">
      <span className="eyebrow-line" /> laundry, made lighter</p><h1>More time for living. <em>Less time at the sink.</em>
      </h1><p className="hero-lede">FreshFold picks up your laundry, cleans it beautifully, and brings it back when you need it. Your week just got a little roomier.</p>
      <div className="hero-actions"><Link className="button button-dark" to="/register">Schedule a pickup <ArrowRight size={17} /></Link>
      <Link className="quiet-link" to="/about">See how it works <ArrowRight size={15} /></Link></div></div>
      <div className="hero-art"><img src={heroImage} alt="A man carrying a basket of folded laundry" width="512" height="512" /></div></section>
    <section className="ticker"><span>NO MORE LAUNDRY DAYS</span>
    <span>•</span><span>LOCAL CARE, ON YOUR SCHEDULE</span>
    <span>•</span><span>NO MORE LAUNDRY DAYS</span>
    </section>
    <section className="page-shell intro-grid">
      <div>
        <p className="eyebrow">the FreshFold way</p>
        <h2>Careful with your clothes.<br /><em>Careful with your time.</em></h2></div>
        <div className="intro-copy"><p>We believe laundry should disappear into the background of your life. Tell us where and when, then get back to the things that matter.</p><Link className="text-link" to="/about">A better laundry routine <ArrowRight size={15} /></Link></div></section>
    <section className="service-band page-shell">
      <div className="section-heading"><div>
      <p className="eyebrow">popular services</p>
      <h2>Clean, pressed, ready.</h2></div><Link className="text-link" to="/register">View all services <ArrowRight size={15} /></Link></div><div className="service-grid">{services.map((service, index) => <div className="service-tile" key={service.name}><span className="service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description}</p><strong>Vendor pricing at checkout</strong></div>)}</div></section>
    <section className="promise page-shell"><div className="promise-icon"><Sparkles /></div><div><p className="eyebrow">the little promise</p><h2>We treat every piece like it’s your favorite.</h2></div><ul><li><Check size={16} /> Easy pickup windows</li><li><Check size={16} /> Clear, upfront pricing</li><li><Check size={16} /> Care you can feel</li></ul></section>
  </main>
}
