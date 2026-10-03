const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const { ROLES } = require("../utils/constants");

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_NAME?.trim() || "Laundry Admin";

async function createAdmin() {
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in Backend/.env before running this script");
  }
  if (password.length < 6) {
    throw new Error("ADMIN_PASSWORD must be at least 6 characters long");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured. Add it to Backend/.env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = ROLES.ADMIN;
      existingUser.password = password;
      if (!existingUser.fullName?.trim()) existingUser.fullName = fullName;
      await existingUser.save();
      console.log(`Admin account updated: ${email}`);
    } else {
      const newUser = await User.create({
        fullName,
        email,
        password,
        role: ROLES.ADMIN,
      });
      console.log(`Admin created: ${newUser.email}`);
    }
  } finally {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  }
}

createAdmin()
  .catch((err) => {
    console.error(`Could not create admin: ${err.message}`);
    process.exitCode = 1;
  });