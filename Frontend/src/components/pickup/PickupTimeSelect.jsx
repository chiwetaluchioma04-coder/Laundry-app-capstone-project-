import { PICKUP_TIME_OPTIONS } from '../../utils/pickupSchedule'

export default function PickupTimeSelect({ value, onChange, eventLabel = 'pickup' }) {
  const selectedOption = PICKUP_TIME_OPTIONS.find((option) => option.value === value)
  const period = selectedOption?.period || 'AM'
  const availableTimes = PICKUP_TIME_OPTIONS.filter((option) => option.period === period)

  return (
    <>
      <fieldset className="pickup-period">
        <legend>When would you like {eventLabel}?</legend>
        <div className="pickup-period-options">
          <button type="button" className={period === 'AM' ? 'selected' : ''} aria-pressed={period === 'AM'} onClick={() => onChange(PICKUP_TIME_OPTIONS.find((option) => option.period === 'AM').value)}>
            Morning (AM)
          </button>
          <button type="button" className={period === 'PM' ? 'selected' : ''} aria-pressed={period === 'PM'} onClick={() => onChange(PICKUP_TIME_OPTIONS.find((option) => option.period === 'PM').value)}>
            Afternoon/Evening (PM)
          </button>
        </div>
      </fieldset>
      <label>Working-hour time
        <select value={value} onChange={(event) => onChange(event.target.value)} required>
          {!value && <option value="">Choose a time</option>}
          {availableTimes.map(({ value: time, label }) => <option value={time} key={time}>{label}</option>)}
        </select>
      </label>
    </>
  )
}
