import { ArrowRight, CalendarClock, MapPin, ShoppingBag, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../pricing.css'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { createOrder } from '../../api/orderApi'
import { initializePayment } from '../../api/paymentApi'
import { getVendorDirectory } from '../../api/vendorApi'
import { useAuth } from '../../context/AuthContext'
import '../../payment-flow.css'

const services = {
  wash_fold: { label: 'Wash & fold', charges: [['washing', 'Washing']] },
  wash_iron_fold: { label: 'Wash, iron & fold', charges: [['washing', 'Washing'], ['ironing', 'Ironing']] },
  dry_cleaning: { label: 'Dry cleaning', charges: [['dryCleaning', 'Dry cleaning']] },
}

const money = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG')}`

export default function CreateOrderPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [feePercent, setFeePercent] = useState(10)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [draftOrderId, setDraftOrderId] = useState('')
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [form, setForm] = useState({
    vendorId: '',
    serviceType: 'wash_fold',
    quantity: '1',
    pickupAddress: user?.address || '',
    pickupDate: '',
  })

  useEffect(() => {
    getVendorDirectory()
      .then(({ data }) => {
        setVendors(data.data.vendors)
        setFeePercent(data.data.customerAppFeePercent)
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Vendor prices are unavailable.'))
      .finally(() => setLoading(false))
  }, [])

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setDraftOrderId('')
    setPaymentDetails(null)
  }
  const vendor = vendors.find((item) => item._id === form.vendorId)
  const service = services[form.serviceType]
  const quantity = Number(form.quantity)
  const lineItems = vendor && Number.isInteger(quantity) && quantity > 0
    ? [
        ...service.charges.map(([rateKey, label]) => ({
          name: label,
          amount: vendor.pricing[rateKey] * quantity,
        })),
        { name: 'Pickup/Delivery', amount: vendor.pricing.pickupDelivery },
      ]
    : []
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const appFee = Math.round((subtotal * feePercent) / 100)
  const total = subtotal + appFee

  async function submit(event) {
    event.preventDefault()
    if (!vendor) return setError('Choose a vendor to see their current prices.')
    if (!lineItems.length || lineItems.some((item) => !Number.isFinite(item.amount))) {
      return setError('Enter a whole number of clothes to get a price.')
    }

    setBusy(true)
    setError('')
    try {
      let orderId = draftOrderId
      if (!orderId) {
        const { data } = await createOrder({ ...form, quantity })
        orderId = data.data.order._id
        setDraftOrderId(orderId)
      }
      const { data } = await initializePayment(orderId)
      setPaymentDetails(data.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not prepare transfer details. Your quoted order is kept so you can retry.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading vendor prices" />

  return (
    <main className="app-page page-shell">
      <div className="page-title">
        <p className="eyebrow">start fresh</p>
        <h1>Book a laundry pickup</h1>
        <p className="muted">Choose a vendor and review every charge before checkout.</p>
      </div>
      <form className="schedule-layout" onSubmit={submit}>
        <section className="detail-panel form-section">
          <div className="panel-heading"><Store size={19} /><h2>Your service</h2></div>
          {vendors.length ? (
            <>
              <label>Vendor
                <select name="vendorId" value={form.vendorId} onChange={update} required>
                  <option value="">Choose a vendor</option>
                  {vendors.map((item) => <option value={item._id} key={item._id}>{item.businessName || item.fullName}</option>)}
                </select>
              </label>
              <label>Service
                <select name="serviceType" value={form.serviceType} onChange={update}>
                  {Object.entries(services).map(([value, item]) => <option value={value} key={value}>{item.label}</option>)}
                </select>
              </label>
              <label>Number of clothes
                <input name="quantity" type="number" min="1" step="1" value={form.quantity} onChange={update} required />
              </label>
            </>
          ) : (
            <div className="empty-state"><Store size={24} /><h3>No vendors are ready yet</h3><p>Vendors will appear here once they publish their prices.</p></div>
          )}
          <div className="panel-heading"><MapPin size={19} /><h2>Pickup details</h2></div>
          <label>Pickup address
            <textarea name="pickupAddress" value={form.pickupAddress} onChange={update} rows="2" required />
          </label>
          <label><span className="field-label-icon"><CalendarClock size={15} /> Pickup date and time</span>
            <input name="pickupDate" type="datetime-local" value={form.pickupDate} onChange={update} required />
          </label>
        </section>

        <section className="detail-panel form-section">
          <div className="panel-heading"><ShoppingBag size={19} /><h2>Price breakdown</h2></div>
          {vendor && lineItems.length ? (
            <>
              {lineItems.map((item) => (
                <div className="line-item" key={item.name}><span>{item.name}</span><strong>{money(item.amount)}</strong></div>
              ))}
              <div className="total-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <div className="line-item"><span>App fee ({feePercent}%)</span><strong>{money(appFee)}</strong></div>
              <div className="total-line checkout-total"><span>Total due</span><strong>{money(total)}</strong></div>
              <p className="muted fee-note">The vendor also pays a separate {feePercent}% platform fee from their earnings after delivery.</p>
            </>
          ) : (
            <p className="muted">Select a vendor and enter the number of clothes to see your itemized total.</p>
          )}
          {error && <ErrorMessage message={error} />}
          <button className="button button-dark full-button" disabled={busy || !vendors.length || !total}>
            {busy ? 'Preparing transfer details...' : draftOrderId ? 'Show transfer details' : 'Continue to payment'} <ArrowRight size={17} />
          </button>
        </section>
      </form>
      {paymentDetails && (
        <section className="transfer-panel" aria-live="polite">
          <div>
            <p className="eyebrow">bank transfer</p>
            <h2>Pay Folded directly</h2>
            <p className="muted">Transfer the exact amount below. Use the payment reference as your narration so our team can match your alert.</p>
          </div>
          <dl className="transfer-details">
            <div><dt>Bank</dt><dd>{paymentDetails.transferDetails.bankName}</dd></div>
            <div><dt>Account name</dt><dd>{paymentDetails.transferDetails.accountName}</dd></div>
            <div><dt>Account number</dt><dd>{paymentDetails.transferDetails.accountNumber}</dd></div>
            <div><dt>Amount</dt><dd>{money(paymentDetails.amount)}</dd></div>
            <div><dt>Payment reference</dt><dd>{paymentDetails.reference}</dd></div>
          </dl>
          <p className="transfer-waiting">Your order stays pending until an admin confirms the payment in the bank account.</p>
        </section>
      )}
    </main>
  )
}