const assert = require("node:assert/strict");
const test = require("node:test");
const {
  getDeliveryDateError,
  getPickupDateError,
  MAX_DELIVERY_SCHEDULE_CHANGES,
  MAX_PICKUP_DATE_CHANGES,
} = require("./pickupSchedule");

const now = new Date("2026-01-01T00:00:00.000Z");

test("allows future pickups during Lagos working hours, including both boundaries", () => {
  assert.equal(getPickupDateError(new Date("2026-01-01T08:00:00.000Z"), now), null);
  assert.equal(getPickupDateError(new Date("2026-01-01T17:00:00.000Z"), now), null);
});

test("rejects pickups outside Lagos working hours or in the past", () => {
  assert.match(getPickupDateError(new Date("2026-01-01T07:59:00.000Z"), now), /9:00 AM and 6:00 PM/);
  assert.match(getPickupDateError(new Date("2026-01-01T17:01:00.000Z"), now), /9:00 AM and 6:00 PM/);
  assert.match(getPickupDateError(now, now), /in the future/);
  assert.match(getPickupDateError(new Date("invalid"), now), /valid pickup date/);
});

test("limits pickup date changes to two", () => {
  assert.equal(MAX_PICKUP_DATE_CHANGES, 2);
});

test("allows future deliveries during Lagos working hours, including both boundaries", () => {
  assert.equal(getDeliveryDateError(new Date("2026-01-01T08:00:00.000Z"), now), null);
  assert.equal(getDeliveryDateError(new Date("2026-01-01T17:00:00.000Z"), now), null);
});

test("rejects deliveries outside Lagos working hours or in the past", () => {
  assert.match(getDeliveryDateError(new Date("2026-01-01T07:59:00.000Z"), now), /9:00 AM and 6:00 PM/);
  assert.match(getDeliveryDateError(new Date("2026-01-01T17:01:00.000Z"), now), /9:00 AM and 6:00 PM/);
  assert.match(getDeliveryDateError(now, now), /in the future/);
  assert.match(getDeliveryDateError(new Date("invalid"), now), /valid delivery date/);
});

test("limits delivery schedule changes to two", () => {
  assert.equal(MAX_DELIVERY_SCHEDULE_CHANGES, 2);
});
