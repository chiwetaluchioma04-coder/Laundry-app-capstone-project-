const createPayment = async ({ amount, reference }) => ({
  status: "pending",
  amount,
  reference,
  message: "Payment provider integration is pending",
});

module.exports = { createPayment };