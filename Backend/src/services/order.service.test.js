const assert = require("node:assert/strict");
const test = require("node:test");
const { calculateOrderPricing } = require("./order.service");

const vendorPricing = {
  washing: 3000,
  ironing: 1000,
  dryCleaning: 2500,
  pickupDelivery: 1000,
};

test("itemizes the example and applies separate customer and vendor fees", () => {
  const quote = calculateOrderPricing({ vendorPricing, serviceType: "wash_iron_fold", quantity: 1 });

  assert.deepEqual(quote.lineItems, [
    { name: "Washing", quantity: 1, unitPrice: 3000, amount: 3000 },
    { name: "Ironing", quantity: 1, unitPrice: 1000, amount: 1000 },
    { name: "Pickup/Delivery", quantity: 1, unitPrice: 1000, amount: 1000 },
  ]);
  assert.equal(quote.subtotal, 5000);
  assert.equal(quote.customerAppFee, 500);
  assert.equal(quote.totalAmount, 5500);
  assert.equal(quote.platformFee, 500);
  assert.equal(quote.vendorEarning, 4500);
});

test("multiplies per-cloth rates while charging pickup and delivery once", () => {
  const quote = calculateOrderPricing({ vendorPricing, serviceType: "wash_iron_fold", quantity: 2 });

  assert.equal(quote.subtotal, 9000);
  assert.equal(quote.lineItems[2].amount, 1000);
  assert.equal(quote.totalAmount, 9900);
  assert.equal(quote.vendorEarning, 8100);
});

test("rejects fractional quantities and missing service rates", () => {
  assert.throws(
    () => calculateOrderPricing({ vendorPricing, serviceType: "wash_fold", quantity: 1.5 }),
    /whole number/
  );
  assert.throws(
    () => calculateOrderPricing({ vendorPricing: { pickupDelivery: 1000 }, serviceType: "wash_fold", quantity: 1 }),
    /washing price/
  );
});