const labels = { requested: 'Requested', assigned: 'Driver assigned', picked_up: 'Picked up', completed: 'Completed', cancelled: 'Cancelled' }
export default function PickupStatusBadge({ status }) { return <span className={`status status-${status}`}>{labels[status] || status}</span> }
