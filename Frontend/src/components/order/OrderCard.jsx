import { ArrowUpRight, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import OrderTracker from './OrderTracker'

export default function OrderCard({ order }) { return <article className="order-card"><div className="card-top"><div className="order-id"><Package size={18} /> <span>Order #{order._id?.slice(-6)}</span></div><strong>₦{Number(order.total).toLocaleString()}</strong></div><OrderTracker status={order.status} /><div className="order-footer"><span className="muted">{order.items?.length || 0} service{order.items?.length === 1 ? '' : 's'}</span><Link className="text-link" to={`/orders/${order._id}`}>View order <ArrowUpRight size={15} /></Link></div></article> }
