import { BellRing } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../api/orderApi'
import { useAuth } from '../../context/AuthContext'

export default function DeliveryNotificationBanner() {
  const { user } = useAuth()
  const [readyOrders, setReadyOrders] = useState([])

  useEffect(() => {
    if (user?.role !== 'customer') {
      setReadyOrders([])
      return undefined
    }

    let active = true
    const refresh = () => {
      getOrders()
        .then(({ data }) => {
          if (active) {
            setReadyOrders(data.data.orders.filter((order) =>
              order.status === 'ready_for_delivery' && !order.deliverySchedule?.deliveryAt
            ))
          }
        })
        .catch(() => {})
    }

    refresh()
    const interval = window.setInterval(refresh, 30000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [user?.id, user?.role])

  if (!readyOrders.length) return null

  return (
    <aside className="delivery-notifications" role="status" aria-live="polite">
      {readyOrders.map((order) => (
        <div className="delivery-notification" key={order._id}>
          <BellRing size={18} />
          <p><strong>Your laundry is ready.</strong> Choose a delivery date and time for order #{order._id.slice(-6)}.</p>
          <Link to={`/orders/${order._id}`}>Choose a time</Link>
        </div>
      ))}
    </aside>
  )
}