require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");

const [, , email, password, ...nameParts] = process.argv;
const name = nameParts.join(" ") || "Laundry Admin";

if (!email || !password) {
  console.error("Usage: npm run create-admin -- admin@example.com password123 \"Admin Name\"");
  process.exit(1);
}

async function createAdmin() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured. Add it to Backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    existingUser.role = "admin";
    if (!existingUser.name || !existingUser.name.trim()) {
      existingUser.name = name;
    }

    await existingUser.save();
    console.log(`Existing user promoted to admin: ${normalizedEmail}`);
    return;
  }

  const newUser = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: "admin",
  });

  console.log(`Admin created: ${newUser.email}`);
}

createAdmin()
  .then(async () => {
    await mongoose.disconnect();
  })
  .catch(async (err) => {
    console.error(`Could not create admin: ${err.message}`);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error(`Disconnect warning: ${disconnectError.message}`);
    }

    process.exit(1);
  });