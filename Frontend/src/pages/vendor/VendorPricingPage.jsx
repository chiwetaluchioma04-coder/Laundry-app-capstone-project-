import { ArrowRight, CircleDollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getVendorPricing, updateVendorPricing } from '../../api/vendorApi'
import '../../pricing.css'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const fields = [
  ['washing', 'Washing per cloth'],
  ['ironing', 'Ironing per cloth'],
  ['dryCleaning', 'Dry cleaning per cloth'],
  ['pickupDelivery', 'Pickup/Delivery per order'],
]

export default function VendorPricingPage() {
  const [form, setForm] = useState({ washing: '', ironing: '', dryCleaning: '', pickupDelivery: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [feePercent, setFeePercent] = useState(10)

  useEffect(() => {
    getVendorPricing()
      .then(({ data }) => {
        const pricing = data.data.pricing || {}
        setFeePercent(data.data.vendorFeePercent)
        setForm(Object.fromEntries(fields.map(([key]) => [key, pricing[key] ?? ''])))
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load your current prices.'))
      .finally(() => setLoading(false))
  }, [])

  const update = (event) => {
    setSaved(false)
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const pricing = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Number(value)]))
      await updateVendorPricing(pricing)
      setSaved(true)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save your prices.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading vendor pricing" />

  return (
    <main className="app-page page-shell narrow-content">
      <div className="page-title">
        <p className="eyebrow">vendor setup</p>
        <h1>Your service prices</h1>
        <p className="muted">Set what you charge per cloth. Pickup/Delivery is a flat fee per order. A {feePercent}% platform fee is deducted before earnings are added to your wallet after payment verification.</p>
      </div>
      <form className="detail-panel profile-form form-section" onSubmit={submit}>
        <span className="round-icon"><CircleDollarSign size={18} /></span>
        {fields.map(([name, label]) => (
          <label key={name}>{label}
            <span className="currency-input"><span>₦</span><input name={name} type="number" min="1" step="1" value={form[name]} onChange={update} required /></span>
          </label>
        ))}
        {error && <ErrorMessage message={error} />}
        <button className="button button-dark full-button" disabled={busy}>{busy ? 'Saving prices...' : saved ? 'Prices saved' : 'Save prices'} <ArrowRight size={16} /></button>
      </form>
    </main>
  )
}