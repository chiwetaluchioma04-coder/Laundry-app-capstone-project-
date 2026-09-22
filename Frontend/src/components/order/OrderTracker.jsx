const steps = ['pending', 'processing', 'ready', 'delivered']
const labels = { pending: 'Order received', processing: 'Being cleaned', ready: 'Ready for return', delivered: 'Delivered' }
export default function OrderTracker({ status }) { const current = steps.indexOf(status); return <div className="tracker">{steps.map((step, index) => <div className={index <= current ? 'track-step active' : 'track-step'} key={step}><span className="track-dot" /><span>{labels[step]}</span></div>)}</div> }
