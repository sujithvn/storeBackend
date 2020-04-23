// Imports
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

// Initialise
const app = express();
const PORT = process.env.SERVER_PORT || 8000;


// Middleware
app.use(morgan("dev"));



// Server response
app.get("/", (req, res) => {
  res.send("Hello from NODEjs server");
});

app.listen(PORT, () => {
  console.log(`Server running & listening to port ${PORT}`);
});