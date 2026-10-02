const Order = require("../models/Order");
const {
  CUSTOMER_APP_FEE_PERCENT,
  SERVICE_STATUS_FLOWS,
  SERVICE_TYPES,
  VENDOR_FEE_PERCENT,
} = require("../utils/constants");

const createError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

const calculateOrderPricing = ({ vendorPricing, serviceType, quantity }) => {
  const service = SERVICE_TYPES[serviceType];
  if (!service) throw createError("Unsupported service type", 400);
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw createError("Quantity must be a positive whole number of clothes", 400);
  }
  if (
    !Number.isFinite(CUSTOMER_APP_FEE_PERCENT) ||
    CUSTOMER_APP_FEE_PERCENT < 0 ||
    CUSTOMER_APP_FEE_PERCENT > 100 ||
    !Number.isFinite(VENDOR_FEE_PERCENT) ||
    VENDOR_FEE_PERCENT < 0 ||
    VENDOR_FEE_PERCENT > 100
  ) {
    throw createError("Configured app fees must be between 0 and 100 percent", 500);
  }

  const lineItems = service.chargeKeys.map(({ key, label }) => {
    const unitPrice = vendorPricing[key];
    if (!Number.isSafeInteger(unitPrice) || unitPrice < 1) {
      throw createError(`Vendor has not set a valid ${label.toLowerCase()} price`, 400);
    }
    return { name: label, quantity, unitPrice, amount: unitPrice * quantity };
  });

  const pickupDeliveryFee = vendorPricing.pickupDelivery;
  if (!Number.isSafeInteger(pickupDeliveryFee) || pickupDeliveryFee < 0) {
    throw createError("Vendor has not set a valid pickup/delivery fee", 400);
  }
  lineItems.push({ name: "Pickup/Delivery", quantity: 1, unitPrice: pickupDeliveryFee, amount: pickupDeliveryFee });

  const subtotal = lineItems.reduce((total, item) => total + item.amount, 0);
  if (subtotal < 1) throw createError("Order subtotal must be greater than zero", 400);
  const customerAppFee = Math.round((subtotal * CUSTOMER_APP_FEE_PERCENT) / 100);
  const platformFee = Math.round((subtotal * VENDOR_FEE_PERCENT) / 100);

  return {
    lineItems,
    subtotal,
    customerAppFee,
    totalAmount: subtotal + customerAppFee,
    platformFee,
    vendorEarning: subtotal - platformFee,
  };
};

const receiveOrder = async (orderId, vendorId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, vendor: vendorId, paymentStatus: "paid", status: "scheduled" },
    {
      $set: { status: "received" },
      $push: { statusHistory: { status: "received", updatedBy: vendorId, at: new Date() } },
    },
    { returnDocument: "after", runValidators: true }
  );

  if (order) return order;
  const exists = await Order.exists({ _id: orderId });
  if (!exists) throw createError("Order not found", 404);
  throw createError("This order is no longer available", 409);
};

const updateOrderStatus = async ({ orderId, vendorId, status }) => {
  const current = await Order.findOne({ _id: orderId, vendor: vendorId });
  if (!current) throw createError("Order not found", 404);

  const flow = SERVICE_STATUS_FLOWS[current.serviceType];
  const nextStatus = flow?.[flow.indexOf(current.status) + 1];
  if (!nextStatus || status !== nextStatus) {
    throw createError(`Order must move to ${nextStatus || "no further status"}`, 409);
  }
  if (nextStatus === "delivered" && !current.deliverySchedule?.deliveryAt) {
    throw createError("The customer must choose a delivery date and time first", 409);
  }

  if (nextStatus !== "delivered") {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, vendor: vendorId, status: current.status },
      { $set: { status: nextStatus }, $push: { statusHistory: { status: nextStatus, updatedBy: vendorId, at: new Date() } } },
      { returnDocument: "after", runValidators: true }
    );
    if (!order) throw createError("Order status changed; reload and try again", 409);
    return order;
  }

  const order = await Order.findOneAndUpdate(
    { _id: orderId, vendor: vendorId, status: current.status },
    { $set: { status: "delivered" }, $push: { statusHistory: { status: "delivered", updatedBy: vendorId, at: new Date() } } },
    { returnDocument: "after", runValidators: true }
  );
  if (!order) throw createError("Order status changed; reload and try again", 409);
  return order;
};

module.exports = { calculateOrderPricing, receiveOrder, updateOrderStatus };