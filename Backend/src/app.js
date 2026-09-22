require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const orderRoutes = require("./routes/orderRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ success: true, message: "Laundry Pickup API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
if (require.main === module) {
  connectDB()
    .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
    .catch((err) => { console.error(`Unable to start server: ${err.message}`); process.exit(1); });
}

module.exports = app;