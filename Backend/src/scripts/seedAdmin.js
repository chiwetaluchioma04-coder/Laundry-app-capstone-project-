const User = require("../models/User");
const { ROLES } = require("../utils/constants");

async function seedAdminUser() {
  const existingAdmin = await User.findOne({ role: ROLES.ADMIN });

  if (existingAdmin) {
    console.log("Admin account already exists in database. Skipping seed.");
    return existingAdmin;
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME?.trim() || "Laundry Admin";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in Backend/.env to seed an admin account");
  }
  if (password.length < 6) {
    throw new Error("ADMIN_PASSWORD must be at least 6 characters long");
  }

  const admin = await User.create({
    fullName,
    email,
    password,
    role: ROLES.ADMIN,
  });

  console.log(`Admin account [${admin.email}] seeded successfully!`);
  return admin;
}

module.exports = seedAdminUser;
