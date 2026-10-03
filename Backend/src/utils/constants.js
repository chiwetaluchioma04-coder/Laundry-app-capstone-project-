const ROLES = Object.freeze({
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ADMIN: "admin",
});

const PUBLIC_ROLES = Object.freeze([ROLES.CUSTOMER, ROLES.VENDOR]);

const SERVICE_TYPES = Object.freeze({
  wash_fold: Object.freeze({
    label: "Wash, Fold",
    chargeKeys: Object.freeze([{ key: "washing", label: "Washing" }]),
  }),
  wash_iron_fold: Object.freeze({
    label: "Wash, Iron, Fold",
    chargeKeys: Object.freeze([
      { key: "washing", label: "Washing" },
      { key: "ironing", label: "Ironing" },
    ]),
  }),
  dry_cleaning: Object.freeze({
    label: "Dry Cleaning",
    chargeKeys: Object.freeze([{ key: "dryCleaning", label: "Dry Cleaning" }]),
  }),
});

const SERVICE_STATUS_FLOWS = Object.freeze({
  wash_fold: Object.freeze(["received", "washing", "ready_for_delivery", "delivered"]),
  wash_iron_fold: Object.freeze(["received", "washing", "ironing", "ready_for_delivery", "delivered"]),
  dry_cleaning: Object.freeze(["received", "dry_cleaning", "ready_for_delivery", "delivered"]),
});

const ORDER_STATUSES = Object.freeze([
  "awaiting_payment",
  "scheduled",
  "received",
  "washing",
  "ironing",
  "dry_cleaning",
  "ready_for_delivery",
  "delivered",
]);

const WITHDRAWAL_STATUSES = Object.freeze(["processing", "paid", "failed"]);
const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT || 10);
const CUSTOMER_APP_FEE_PERCENT = PLATFORM_FEE_PERCENT;
const VENDOR_FEE_PERCENT = PLATFORM_FEE_PERCENT;
const MIN_WITHDRAWAL_AMOUNT = 1000;

module.exports = {
  CUSTOMER_APP_FEE_PERCENT,
  MIN_WITHDRAWAL_AMOUNT,
  ORDER_STATUSES,
  PLATFORM_FEE_PERCENT,
  PUBLIC_ROLES,
  ROLES,
  SERVICE_STATUS_FLOWS,
  SERVICE_TYPES,
  WITHDRAWAL_STATUSES,
  VENDOR_FEE_PERCENT,
};