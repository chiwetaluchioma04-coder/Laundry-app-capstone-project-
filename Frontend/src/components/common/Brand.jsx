export default function Brand({ className = '' }) {
  return (
    <span className={`brand ${className}`.trim()}>
      <img className="brand-logo" src="/favicon.svg" alt="" />
      <span>FreshFold</span>
    </span>
  )
}
