import { ArrowRight, Banknote, CircleDollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getWallet, getWithdrawals, requestWithdrawal } from '../../api/walletApi'
import { updateBankDetails } from '../../api/vendorApi'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import '../../payment-flow.css'

const money = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG')}`

export default function VendorWalletPage() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [minimum, setMinimum] = useState(1000)
  const [withdrawals, setWithdrawals] = useState([])
  const [bank, setBank] = useState({ bankName: user?.bankName || '', accountName: user?.accountName || '', accountNumber: user?.accountNumber || '' })
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    const [walletResponse, withdrawalResponse] = await Promise.all([getWallet(), getWithdrawals()])
    setBalance(walletResponse.data.data.balance)
    setMinimum(walletResponse.data.data.minimumWithdrawal)
    setWithdrawals(withdrawalResponse.data.data.withdrawals)
  }

  useEffect(() => {
    refresh()
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load your wallet.'))
      .finally(() => setLoading(false))
  }, [])

  const updateBank = (event) => setBank((current) => ({ ...current, [event.target.name]: event.target.value }))

  async function saveBank(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await updateBankDetails(bank)
      setMessage('Bank details saved.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save bank details.')
    } finally {
      setBusy(false)
    }
  }

  async function withdraw(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await requestWithdrawal(Number(amount))
      setMessage(response.data.message || 'Withdrawal request submitted for manual payout.')
      setAmount('')
      await refresh()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not submit withdrawal request.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading your wallet" />

  return (
    <main className="app-page page-shell wallet-page">
      <div className="page-title">
        <p className="eyebrow">vendor account</p>
        <h1>Your wallet</h1>
        <p className="muted">Verified customer payments add your earnings here. Withdrawals are sent manually to your saved bank account.</p>
      </div>
      {error && <ErrorMessage message={error} />}
      {message && <p className="success-message">{message}</p>}
      <section className="wallet-balance">
        <span className="round-icon"><CircleDollarSign size={20} /></span>
        <p className="eyebrow">available to withdraw</p>
        <strong>{money(balance)}</strong>
        <small>Minimum request {money(minimum)}</small>
      </section>
      <div className="wallet-grid">
        <form className="detail-panel profile-form" onSubmit={saveBank}>
          <div className="panel-heading"><Banknote size={19} /><h2>Payout account</h2></div>
          <label>Bank name<input name="bankName" value={bank.bankName} onChange={updateBank} required /></label>
          <label>Account name<input name="accountName" value={bank.accountName} onChange={updateBank} required /></label>
          <label>Account number<input name="accountNumber" inputMode="numeric" value={bank.accountNumber} onChange={updateBank} required /></label>
          <button className="button button-dark" disabled={busy}>Save bank details <ArrowRight size={16} /></button>
        </form>
        <form className="detail-panel profile-form" onSubmit={withdraw}>
          <div className="panel-heading"><CircleDollarSign size={19} /><h2>Request a withdrawal</h2></div>
          <p className="muted wallet-help">Your request reserves the amount. Folded will mark it paid after the bank transfer is sent.</p>
          <label>Amount in naira
            <input name="amount" type="number" min={minimum} max={balance} step="1" value={amount} onChange={(event) => setAmount(event.target.value)} required />
          </label>
          <button className="button button-dark" disabled={busy || balance < minimum}>Request payout <ArrowRight size={16} /></button>
        </form>
      </div>
      <section className="wallet-history">
        <div className="section-heading compact"><div><p className="eyebrow">account activity</p><h2>Withdrawal history</h2></div></div>
        {withdrawals.length ? withdrawals.map((withdrawal) => (
          <div className="wallet-history-row" key={withdrawal._id}>
            <div><strong>{money(withdrawal.amount)}</strong><small>{new Date(withdrawal.createdAt).toLocaleDateString()}</small></div>
            <span className={`status status-${withdrawal.status}`}>{withdrawal.status}</span>
          </div>
        )) : <div className="empty-state"><p>No withdrawal requests yet.</p></div>}
      </section>
    </main>
  )
}