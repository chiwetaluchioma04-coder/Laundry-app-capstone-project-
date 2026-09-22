import { useEffect, useState } from 'react'
import { getOrders } from '../../api/orderApi'
import OrderList from '../../components/order/OrderList'
import LoadingSpinner from '../../components/common/LoadingSpinner'
export default function MyOrdersPage() { const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { getOrders().then(({ data }) => setOrders(data.data.orders)).finally(() => setLoading(false)) }, []); return <main className="app-page page-shell"><div className="page-title"><p className="eyebrow">your history</p><h1>My orders</h1><p className="muted">Every clean, in one place.</p></div>{loading ? <LoadingSpinner /> : orders.length ? <OrderList orders={orders} /> : <div className="empty-state"><h3>No orders yet</h3><p>Your first one is waiting to happen.</p></div>}</main> }
