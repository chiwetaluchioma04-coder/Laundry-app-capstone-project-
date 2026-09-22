import { CalendarDays, MapPin } from 'lucide-react'
import PickupStatusBadge from './PickupStatusBadge'

export default function PickupCard({ pickup }) {
  return <article className="pickup-card"><div className="card-top"><PickupStatusBadge status={pickup.status} /><span className="muted">#{pickup._id?.slice(-6)}</span></div><div className="pickup-info"><div><MapPin size={17} /><span>{pickup.address}</span></div><div><CalendarDays size={17} /><span>{new Date(pickup.scheduledFor).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></div></div>{pickup.notes && <p className="muted note">{pickup.notes}</p>}</article>
}
