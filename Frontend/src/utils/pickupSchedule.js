const BUSINESS_TIME_ZONE = 'Africa/Lagos'

export const MAX_DELIVERY_SCHEDULE_CHANGES = 2

export const PICKUP_TIME_OPTIONS = Array.from({ length: 19 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  const displayHour = hour % 12 || 12
  const period = hour < 12 ? 'AM' : 'PM'

  return { value, label: `${displayHour}:${String(minute).padStart(2, '0')}`, period }
})

const getPartsInBusinessZone = (date) => Object.fromEntries(
  new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date).map(({ type, value }) => [type, value]),
)

export const getTodayInBusinessZone = () => {
  const { year, month, day } = getPartsInBusinessZone(new Date())
  return `${year}-${month}-${day}`
}

export const toBusinessDateTimeInput = (date) => {
  const { year, month, day, hour, minute } = getPartsInBusinessZone(new Date(date))
  return { date: `${year}-${month}-${day}`, time: `${hour}:${minute}` }
}

export const formatPickupDateTime = (date, options = { dateStyle: 'medium', timeStyle: 'short' }) => (
  new Intl.DateTimeFormat(undefined, { ...options, timeZone: BUSINESS_TIME_ZONE }).format(new Date(date))
)

export const toBusinessDateTimeIso = (date, time) => {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute)
  let timestamp = targetAsUtc

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = getPartsInBusinessZone(new Date(timestamp))
    const representedAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
    )
    timestamp += targetAsUtc - representedAsUtc
  }

  return new Date(timestamp).toISOString()
}
