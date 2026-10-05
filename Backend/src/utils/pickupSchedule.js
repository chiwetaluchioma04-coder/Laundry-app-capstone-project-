const BUSINESS_TIME_ZONE = "Africa/Lagos";
const WORKING_HOURS_START = 9 * 60;
const WORKING_HOURS_END = 18 * 60;
const MAX_PICKUP_DATE_CHANGES = 2;
const MAX_DELIVERY_SCHEDULE_CHANGES = 2;

const getTimeInBusinessZone = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find(({ type }) => type === "hour").value);
  const minute = Number(parts.find(({ type }) => type === "minute").value);
  return hour * 60 + minute;
};

const getPickupDateError = (date, now = new Date()) => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    return "Choose a valid pickup date and time";
  }
  if (date <= now) return "Choose a pickup date and time in the future";

  const time = getTimeInBusinessZone(date);
  if (time < WORKING_HOURS_START || time > WORKING_HOURS_END) {
    return "Pickup time must be between 9:00 AM and 6:00 PM Nigeria time";
  }
  return null;
};

const getDeliveryDateError = (date, now = new Date()) => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    return "Choose a valid delivery date and time";
  }
  if (date <= now) return "Choose a delivery date and time in the future";

  const time = getTimeInBusinessZone(date);
  if (time < WORKING_HOURS_START || time > WORKING_HOURS_END) {
    return "Delivery time must be between 9:00 AM and 6:00 PM Nigeria time";
  }
  return null;
};

module.exports = {
  getDeliveryDateError,
  getPickupDateError,
  MAX_DELIVERY_SCHEDULE_CHANGES,
  MAX_PICKUP_DATE_CHANGES,
};
