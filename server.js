// Imports
const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const subcategoryRoutes = require("./routes/subcategory");
const productRoutes = require("./routes/product");

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
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/product", productRoutes);


app.listen(PORT, () => {
  console.log(`Server running & listening to port ${PORT}`);
});