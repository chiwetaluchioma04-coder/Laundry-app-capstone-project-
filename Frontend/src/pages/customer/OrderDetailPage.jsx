import { ArrowLeft, MapPin, ReceiptText } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrder, scheduleDelivery } from '../../api/orderApi'
import { initializePayment } from '../../api/paymentApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import OrderHistory from '../../components/order/OrderHistory'
import OrderTracker from '../../components/order/OrderTracker'
import '../../payment-flow.css'

const localDateTimeValue = (date) => {
	const localDate = new Date(date)
	localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset())
	return localDate.toISOString().slice(0, 16)
}

export default function OrderDetailPage() {
	const { id } = useParams()
	const [order, setOrder] = useState(null)
	const [paymentDetails, setPaymentDetails] = useState(null)
	const [paymentError, setPaymentError] = useState('')
	const [deliveryDate, setDeliveryDate] = useState('')
	const [deliveryBusy, setDeliveryBusy] = useState(false)
	const [deliveryMessage, setDeliveryMessage] = useState('')
	const [deliveryError, setDeliveryError] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getOrder(id)
			.then(async ({ data }) => {
				const currentOrder = data.data.order
				setOrder(currentOrder)
				if (currentOrder.deliverySchedule?.deliveryAt) {
					setDeliveryDate(localDateTimeValue(currentOrder.deliverySchedule.deliveryAt))
				}
				if (currentOrder.paymentStatus === 'pending' && currentOrder.status === 'awaiting_payment') {
					try {
						const paymentResponse = await initializePayment(id)
						setPaymentDetails(paymentResponse.data.data)
					} catch (requestError) {
						setPaymentError(requestError.response?.data?.message || 'Bank transfer details are unavailable right now.')
					}
				}
			})
			.finally(() => setLoading(false))
	}, [id])

	async function saveDeliveryDate(event) {
		event.preventDefault()
		setDeliveryBusy(true)
		setDeliveryMessage('')
		setDeliveryError('')
		try {
			const response = await scheduleDelivery(id, new Date(deliveryDate).toISOString())
			setOrder(response.data.data.order)
			setDeliveryMessage('Your delivery time has been saved.')
		} catch (requestError) {
			setDeliveryError(requestError.response?.data?.message || 'Could not save your delivery time.')
		} finally {
			setDeliveryBusy(false)
		}
	}

	if (loading) return <LoadingSpinner label="Finding your order" />
	if (!order) return <main className="app-page page-shell"><p>Order not found.</p><Link className="back-link" to="/orders"><ArrowLeft size={15} /> Back to orders</Link></main>

	return (
		<main className="app-page page-shell detail-page">
			<Link className="back-link" to="/orders"><ArrowLeft size={15} /> Back to orders</Link>
			<div className="detail-header">
				<div><p className="eyebrow">order #{order._id.slice(-6)}</p><h1>In good hands<span className="brand-dot">.</span></h1><p className="muted">Placed {new Date(order.createdAt).toLocaleDateString([], { dateStyle: 'long' })}</p></div>
				<div className="order-status-stack">
					<span className={`status status-${order.status}`}>{order.status.replaceAll('_', ' ')}</span>
					<span className={`status status-${order.paymentStatus}`}>payment {order.paymentStatus === 'pending' ? 'awaiting verification' : order.paymentStatus}</span>
				</div>
			</div>
			<section className="detail-panel"><h2>Its journey</h2><OrderTracker status={order.status} serviceType={order.serviceType} /></section>
			<section className="detail-panel"><h2>Order history</h2><OrderHistory entries={order.statusHistory} /></section>
			<div className="detail-grid">
				<section className="detail-panel">
					<div className="panel-heading"><ReceiptText size={19} /><h2>Charge summary</h2></div>
					{order.lineItems.map((item) => <div className="line-item" key={item.name}><span>{item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ''}</span><strong>₦{Number(item.amount).toLocaleString('en-NG')}</strong></div>)}
					<div className="total-line"><span>Subtotal</span><strong>₦{Number(order.subtotal).toLocaleString('en-NG')}</strong></div>
					<div className="line-item"><span>App fee</span><strong>₦{Number(order.customerAppFee).toLocaleString('en-NG')}</strong></div>
					<div className="total-line checkout-total"><span>Total charged</span><strong>₦{Number(order.totalAmount).toLocaleString('en-NG')}</strong></div>
				</section>
				<section className="detail-panel yellow-panel"><MapPin size={20} /><h2>Pickup & return</h2><p>{order.pickupAddress}</p><p className="muted">{new Date(order.pickupDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p><p className="muted">Your vendor: {order.vendor?.businessName || order.vendor?.fullName || 'Assigned vendor'}</p></section>
			</div>
			{order.paymentStatus === 'pending' && (
				<section className="transfer-panel order-transfer-panel">
					<div><p className="eyebrow">bank transfer</p><h2>Complete your payment</h2><p className="muted">Use the payment reference as your transfer narration. Your order will be scheduled after an admin confirms the bank alert.</p></div>
					{paymentDetails ? (
						<dl className="transfer-details">
							<div><dt>Bank</dt><dd>{paymentDetails.transferDetails.bankName}</dd></div>
							<div><dt>Account name</dt><dd>{paymentDetails.transferDetails.accountName}</dd></div>
							<div><dt>Account number</dt><dd>{paymentDetails.transferDetails.accountNumber}</dd></div>
							<div><dt>Amount</dt><dd>₦{Number(paymentDetails.amount).toLocaleString('en-NG')}</dd></div>
							<div><dt>Payment reference</dt><dd>{paymentDetails.reference}</dd></div>
						</dl>
					) : <p className="muted">{paymentError || 'Loading your payment details...'}</p>}
				</section>
			)}
			{order.status === 'ready_for_delivery' && (
				<section className="detail-panel delivery-schedule-panel">
					<div><p className="eyebrow">delivery is next</p><h2>Your laundry is ready</h2><p className="muted">Choose a date and time that works for you. Your vendor can complete delivery after you save a slot.</p></div>
					{order.deliverySchedule?.deliveryAt && <p className="delivery-booked">Current slot: <strong>{new Date(order.deliverySchedule.deliveryAt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</strong></p>}
					{deliveryError && <p className="error-message">{deliveryError}</p>}
					{deliveryMessage && <p className="success-message">{deliveryMessage}</p>}
					<form className="delivery-schedule-form" onSubmit={saveDeliveryDate}>
						<label>Delivery date and time
							<input type="datetime-local" min={localDateTimeValue(Date.now() + 60_000)} value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} required />
						</label>
						<button className="button button-dark" disabled={deliveryBusy}>{deliveryBusy ? 'Saving...' : order.deliverySchedule?.deliveryAt ? 'Update delivery time' : 'Confirm delivery time'}</button>
					</form>
				</section>
			)}
		</main>
	)
}
