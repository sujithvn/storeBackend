// Imports
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// Initialise
const app = express();
const PORT = process.env.SERVER_PORT || 8000;
const DATABASE = process.env.DATABASE;

//DB connectivity
mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Database connected"));
  

// Middleware
app.use(morgan("dev"));



// Server response
app.get("/", (req, res) => {
  res.send("Hello from NODEjs server");
});

app.listen(PORT, () => {
  console.log(`Server running & listening to port ${PORT}`);
});