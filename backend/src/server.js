/*
 * server.js
 *
 * Entry point for the API server. Loads environment variables, connects
 * to the database, and starts the Express application.
 *
 */

const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectToDb = require("./config/db");

connectToDb();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
