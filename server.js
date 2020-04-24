// Imports
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

const authRoutes = require("./routes/auth");

dotenv.config();

// Initialise
const app = express();
const PORT = process.env.SERVER_PORT || 8000;
const DATABASE = process.env.DATABASE;

//DB connectivity
mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Database connected"));
  

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server running & listening to port ${PORT}`);
});