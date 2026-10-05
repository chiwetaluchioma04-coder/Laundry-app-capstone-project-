import { BadgeCheck, Banknote, CircleDollarSign, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getPayments, getPendingWithdrawals, updateWithdrawal, verifyPayment } from '../../api/adminApi'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import '../../payment-flow.css'

const money = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG')}`
const dateTime = (date) => new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })

export default function AdminDashboard() {
  const [payments, setPayments] = useState([])
  const [paymentFilter, setPaymentFilter] = useState('pending')
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    const [paymentResponse, withdrawalResponse] = await Promise.all([getPayments('all'), getPendingWithdrawals()])
    setPayments(paymentResponse.data.data.payments)
    setWithdrawals(withdrawalResponse.data.data.withdrawals)
  }

  useEffect(() => {
    refresh()
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load payment operations.'))
      .finally(() => setLoading(false))
  }, [])

  async function runAction(key, action) {
    setBusy(key)
    setError('')
    try {
      await action()
      await refresh()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'That operation could not be completed.')
    } finally {
      setBusy('')
    }
  }

  if (loading) return <LoadingSpinner label="Loading payment operations" />

  const visiblePayments = payments.filter((payment) =>
    paymentFilter === 'all' || (paymentFilter === 'verified' ? payment.status === 'paid' : payment.status === 'pending')
  )
  const paymentTabs = [
    ['pending', 'Awaiting verification'],
    ['verified', 'Verified'],
    ['all', 'All transfers'],
  ]

  return (
    <main className="app-page page-shell admin-console">
      <div className="page-title admin-title-row">
        <div>
          <p className="eyebrow">FreshFold operations</p>
          <h1>Payments & payouts</h1>
          <p className="muted">Match incoming bank alerts before confirming payments. Record vendor transfers after crediting their accounts.</p>
        </div>
        <button className="icon-button refresh-button" onClick={() => runAction('refresh', refresh)} disabled={Boolean(busy)} aria-label="Refresh queues" title="Refresh queues">
          <RefreshCw size={18} />
        </button>
      </div>
      {error && <ErrorMessage message={error} />}
      <section className="admin-queue">
        <div className="section-heading compact">
          <div><p className="eyebrow"><CircleDollarSign size={14} /> customer transfers</p><h2>Payment history <span className="queue-count">{visiblePayments.length}</span></h2></div>
        </div>
        <div className="order-view-tabs" role="tablist" aria-label="Payment history filters">
          {paymentTabs.map(([value, label]) => (
            <button key={value} type="button" role="tab" aria-selected={paymentFilter === value} className={paymentFilter === value ? 'selected' : ''} onClick={() => setPaymentFilter(value)}>
              {label}<span>{payments.filter((payment) => value === 'all' || (value === 'verified' ? payment.status === 'paid' : payment.status === 'pending')).length}</span>
            </button>
          ))}
        </div>
        {visiblePayments.length ? (
          <div className="admin-review-list">
            {visiblePayments.map((payment) => {
              const order = payment.order
              return (
                <article className="admin-review-row" key={payment._id}>
                  <div className="review-main">
                    <div className="review-heading"><strong>{payment.customer?.fullName || 'Customer'}</strong><span className={`status status-${payment.status === 'paid' ? 'paid' : payment.status}`}>{payment.status === 'paid' ? 'verified' : payment.status}</span><span className="status">{order?.serviceType?.replaceAll('_', ' ') || 'Order'}</span></div>
                    <p className="muted">Order #{order?._id?.slice(-6)} · {order?.vendor?.businessName || order?.vendor?.fullName || 'Vendor'} · {dateTime(payment.createdAt)}</p>
                    <p className="transfer-reference">Transfer reference: <strong>{payment.reference}</strong></p>
                    {payment.status === 'paid' && <small className="muted">Verified {payment.verifiedBy?.fullName ? `by ${payment.verifiedBy.fullName} ` : ''}· {dateTime(payment.paidAt)}</small>}
                  </div>
                  <div className="review-total"><strong>{money(payment.amount)}</strong><small>Vendor share {money(order?.vendorEarning)}</small></div>
                  {payment.status === 'pending' && <button className="button button-dark" onClick={() => runAction(payment._id, () => verifyPayment(payment._id))} disabled={Boolean(busy)}>
                    <BadgeCheck size={16} /> {busy === payment._id ? 'Verifying...' : 'Confirm received'}
                  </button>}
                </article>
              )
            })}
          </div>
        ) : <div className="empty-state"><Banknote size={22} /><p>{paymentFilter === 'verified' ? 'No verified customer payments yet.' : paymentFilter === 'all' ? 'No customer payment records yet.' : 'No customer transfers are waiting for verification.'}</p></div>}
      </section>

      <section className="admin-queue">
        <div className="section-heading compact">
          <div><p className="eyebrow"><Banknote size={14} /> vendor transfers</p><h2>Withdrawal requests <span className="queue-count">{withdrawals.length}</span></h2></div>
        </div>
        {withdrawals.length ? (
          <div className="admin-review-list">
            {withdrawals.map((withdrawal) => (
              <article className="admin-review-row" key={withdrawal._id}>
                <div className="review-main">
                  <div className="review-heading"><strong>{withdrawal.vendor?.businessName || withdrawal.vendor?.fullName || 'Vendor'}</strong><span className="status">{withdrawal.status}</span></div>
                  <p className="muted">{withdrawal.vendor?.email} · Requested {dateTime(withdrawal.createdAt)}</p>
                  <p className="transfer-reference">{withdrawal.bankDetails.bankName} · {withdrawal.bankDetails.accountName} · {withdrawal.bankDetails.accountNumber}</p>
                  <small className="muted">Request ref: {withdrawal.reference}</small>
                </div>
                <div className="review-total"><strong>{money(withdrawal.amount)}</strong></div>
                  <div className="review-actions">
                    {withdrawal.status === 'failed' ? (
                      <button className="button button-light" onClick={() => runAction(`${withdrawal._id}-failed`, () => updateWithdrawal(withdrawal._id, 'failed'))} disabled={Boolean(busy)}>
                        Retry refund
                      </button>
                    ) : (
                      <>
                        <button className="button button-dark" onClick={() => runAction(withdrawal._id, () => updateWithdrawal(withdrawal._id, 'paid'))} disabled={Boolean(busy)}>
                          {busy === withdrawal._id ? 'Saving...' : 'Mark paid'}
                        </button>
                        <button className="button button-light" onClick={() => runAction(`${withdrawal._id}-failed`, () => updateWithdrawal(withdrawal._id, 'failed'))} disabled={Boolean(busy)}>
                          Fail & refund
                        </button>
                      </>
                    )}
                  </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state"><Banknote size={22} /><p>No vendor withdrawals are waiting for payout.</p></div>}
      </section>
    </main>
  )
}