import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowUpRight, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Brand from './Brand'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const links = user?.role === 'vendor' ? [['/vendor/orders', 'Orders'], ['/vendor/pricing', 'Service prices'], ['/vendor/wallet', 'Wallet']] : user?.role === 'admin' ? [['/admin', 'Payments & payouts']] : user ? [['/dashboard', 'Dashboard'], ['/orders', 'My orders']] : [['/about', 'How it works']]

  return <header className="navbar">
    <Link to="/" onClick={() => setOpen(false)} aria-label="FreshFold home"><Brand /></Link>
    <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
    <nav className={open ? 'nav-links open' : 'nav-links'}>
      {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
      {user ? <button className="nav-logout" onClick={() => { logout(); navigate('/') }}><LogOut size={15} /> Sign out</button> : <Link className="nav-cta" to="/login" onClick={() => setOpen(false)}>Get started <ArrowUpRight size={16} /></Link>}
    </nav>
  </header>
}
