import { ArrowRight, CircleCheck, Package, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrders } from '../../api/orderApi'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import OrderCard from '../../components/order/OrderCard'

export default function CustomerDashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(({ data }) => setOrders(data.data.orders))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner label="Preparing your dashboard" />

  const latestOrder = orders[0]
  return (
    <main className="app-page page-shell">
      <div className="welcome-row">
        <div><p className="eyebrow">your folded space</p><h1>Welcome, {user?.name?.split(' ')[0] || 'there'}<span className="brand-dot">.</span></h1><p className="muted">Your next clean start begins here.</p></div>
        <Link className="button button-yellow" to="/schedule"><Plus size={17} /> New order</Link>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><span className="stat-icon"><Package size={18} /></span><strong>{orders.length}</strong><span>total orders</span></div>
        <div className="stat-card"><span className="stat-icon"><CircleCheck size={18} /></span><strong>{orders.filter((order) => order.status === 'delivered').length}</strong><span>delivered</span></div>
        <div className="stat-card"><span className="stat-icon"><Package size={18} /></span><strong>{orders.filter((order) => order.status !== 'delivered').length}</strong><span>in progress</span></div>
      </div>
      <section>
        <div className="section-heading compact"><h2>Latest order</h2><Link className="text-link" to="/orders">See all <ArrowRight size={15} /></Link></div>
        {latestOrder ? <OrderCard order={latestOrder} /> : <div className="empty-state"><Package size={28} /><h3>Your next clean start</h3><p>No orders yet. Choose a vendor and review your charges before checkout.</p><Link className="text-link" to="/schedule">Create an order <ArrowRight size={15} /></Link></div>}
      </section>
    </main>
  )
}