require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const vendorRoutes = require("./routes/vendor.routes");
const walletRoutes = require("./routes/wallet.routes");
const adminRoutes = require("./routes/admin.routes");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.get("/api/health", (req, res) => res.json({ success: true, message: "FreshFold API is running" }));

app.use("/api/payments", paymentRoutes);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;