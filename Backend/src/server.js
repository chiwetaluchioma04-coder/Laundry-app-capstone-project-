require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const seedAdminUser = require("./scripts/seedAdmin");

const port = Number(process.env.PORT || 5000);

async function startServer() {
  await connectDB();
  await seedAdminUser();
  app.listen(port, () => console.log(`FreshFold API listening on port ${port}`));
}

startServer().catch((err) => {
  console.error(`Unable to start API: ${err.message}`);
  process.exit(1);
});
