import { Link } from 'react-router-dom'

export default function Brand({ className = '', onClick }) {
  return (
    <Link to="/" className={`brand ${className}`.trim()} onClick={onClick} aria-label="FreshFold home">
      <img className="brand-logo" src="/favicon.svg" alt="" />
      <span>FreshFold</span>
    </Link>
  )
}
