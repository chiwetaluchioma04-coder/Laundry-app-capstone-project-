import { ArrowRight, ClipboardList, PackageCheck, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAvailableVendorOrders, getVendorOrders, receiveVendorOrder, updateVendorOrderStatus } from '../../api/vendorApi'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import OrderHistory from '../../components/order/OrderHistory'
import OrderTracker from '../../components/order/OrderTracker'
import '../../payment-flow.css'

const flows = {
  wash_fold: ['received', 'washing', 'ready_for_delivery', 'delivered'],
  wash_iron_fold: ['received', 'washing', 'ironing', 'ready_for_delivery', 'delivered'],
  dry_cleaning: ['received', 'dry_cleaning', 'ready_for_delivery', 'delivered'],
}
const labels = { washing: 'Washing', ironing: 'Ironing', dry_cleaning: 'Dry cleaning', ready_for_delivery: 'Ready for delivery', delivered: 'Delivered' }
const money = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG')}`

export default function VendorOrdersPage() {
  const [available, setAvailable] = useState([])
  const [orders, setOrders] = useState([])
  const [view, setView] = useState('available')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    const [availableResponse, ordersResponse] = await Promise.all([getAvailableVendorOrders(), getVendorOrders()])
    setAvailable(availableResponse.data.data.orders)
    setOrders(ordersResponse.data.data.orders)
  }

  useEffect(() => {
    refresh()
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load vendor orders.'))
      .finally(() => setLoading(false))
  }, [])

  async function act(id, action) {
    setBusy(id)
    setError('')
    try {
      await action()
      await refresh()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this order.')
    } finally {
      setBusy('')
    }
  }

  if (loading) return <LoadingSpinner label="Loading vendor orders" />

  const visibleOrders = view === 'available' ? available : orders

  return (
    <main className="app-page page-shell vendor-orders-page">
      <div className="page-title admin-title-row">
        <div>
          <p className="eyebrow">vendor workspace</p>
          <h1>Orders</h1>
          <p className="muted">Receive paid orders, update their progress, and review each order’s status history.</p>
        </div>
        <button className="icon-button refresh-button" onClick={() => act('refresh', refresh)} disabled={Boolean(busy)} aria-label="Refresh orders" title="Refresh orders"><RefreshCw size={18} /></button>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="order-view-tabs" role="tablist" aria-label="Vendor order views">
        <button role="tab" aria-selected={view === 'available'} className={view === 'available' ? 'selected' : ''} onClick={() => setView('available')}><PackageCheck size={16} /> Available <span>{available.length}</span></button>
        <button role="tab" aria-selected={view === 'history'} className={view === 'history' ? 'selected' : ''} onClick={() => setView('history')}><ClipboardList size={16} /> My orders <span>{orders.length}</span></button>
      </div>

      {visibleOrders.length ? (
        <div className="vendor-order-list">
          {visibleOrders.map((order) => {
            const nextStatus = flows[order.serviceType]?.[flows[order.serviceType].indexOf(order.status) + 1]
              const waitingForDeliverySlot = nextStatus === 'delivered' && !order.deliverySchedule?.deliveryAt
            return (
              <article className="vendor-order-card" key={order._id}>
                <div className="vendor-order-heading">
                  <div><p className="eyebrow">order #{order._id.slice(-6)}</p><h2>{order.customer?.fullName || 'Customer'}</h2></div>
                  <div className="order-badges"><span className={`status status-${order.status}`}>{order.status.replaceAll('_', ' ')}</span><span className={`status status-${order.paymentStatus}`}>payment {order.paymentStatus}</span></div>
                </div>
                <div className="vendor-order-facts">
                  <span>{order.pickupAddress}</span>
                  <span>{new Date(order.pickupDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <strong>{money(order.totalAmount)}</strong>
                </div>
                {order.deliverySchedule?.deliveryAt && <p className="delivery-booked">Delivery booked: <strong>{new Date(order.deliverySchedule.deliveryAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</strong></p>}
                <OrderTracker status={order.status} serviceType={order.serviceType} />
                <div className="vendor-order-history">
                  <h3>Order history</h3>
                  <OrderHistory entries={order.statusHistory} />
                </div>
                {view === 'available' ? (
                  <button className="button button-dark" onClick={() => act(order._id, () => receiveVendorOrder(order._id))} disabled={Boolean(busy)}>
                    <PackageCheck size={16} /> {busy === order._id ? 'Receiving...' : 'Receive order'}
                  </button>
                ) : waitingForDeliverySlot ? (
                  <p className="muted delivery-waiting">Waiting for the customer to choose a delivery date and time.</p>
                ) : nextStatus ? (
                  <button className="button button-dark" onClick={() => act(order._id, () => updateVendorOrderStatus(order._id, nextStatus))} disabled={Boolean(busy)}>
                    {busy === order._id ? 'Updating...' : `Update to ${labels[nextStatus] || nextStatus}`} <ArrowRight size={16} />
                  </button>
                ) : null}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="empty-state"><ClipboardList size={24} /><h3>{view === 'available' ? 'No paid orders waiting' : 'No orders yet'}</h3><p>{view === 'available' ? 'New customer orders appear here after payment is verified.' : 'Your order activity will appear here.'}</p></div>
      )}
    </main>
  )
}