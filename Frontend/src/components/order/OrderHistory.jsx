const label = (status) => status.replaceAll('_', ' ')

export default function OrderHistory({ entries = [] }) {
  if (!entries.length) return <p className="muted">No status updates have been recorded.</p>

  return (
    <ol className="order-history">
      {[...entries].sort((left, right) => new Date(left.at) - new Date(right.at)).map((entry, index) => (
        <li key={`${entry.status}-${entry.at}-${index}`}>
          <span className="history-marker" />
          <div className="history-entry">
            <strong>{label(entry.status)}</strong>
            <time dateTime={entry.at}>{new Date(entry.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time>
            {entry.updatedBy?.fullName && <small>Updated by {entry.updatedBy.fullName}</small>}
          </div>
        </li>
      ))}
    </ol>
  )
}