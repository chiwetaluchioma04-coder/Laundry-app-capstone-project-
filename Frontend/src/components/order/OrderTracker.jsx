const flows = {
	wash_fold: ['awaiting_payment', 'scheduled', 'received', 'washing', 'ready_for_delivery', 'delivered'],
	wash_iron_fold: ['awaiting_payment', 'scheduled', 'received', 'washing', 'ironing', 'ready_for_delivery', 'delivered'],
	dry_cleaning: ['awaiting_payment', 'scheduled', 'received', 'dry_cleaning', 'ready_for_delivery', 'delivered'],
}

const labels = {
	awaiting_payment: 'Awaiting payment',
	scheduled: 'Paid',
	received: 'Received',
	washing: 'Washing',
	ironing: 'Ironing',
	dry_cleaning: 'Dry cleaning',
	ready_for_delivery: 'Ready',
	delivered: 'Delivered',
}

export default function OrderTracker({ status, serviceType }) {
	const steps = flows[serviceType] || flows.wash_fold
	const current = steps.indexOf(status)
	return <div className="tracker">{steps.map((step, index) => <div className={index <= current ? 'track-step active' : 'track-step'} key={step}><span className="track-dot" /><span>{labels[step]}</span></div>)}</div>
}
