require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = Number(process.env.PORT || 5000);

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Fresh Fold API listening on port ${port}`));
  })
  .catch((err) => {
    console.error(`Unable to start server: ${err.message}`);
    process.exit(1);
  });