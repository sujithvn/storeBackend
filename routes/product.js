// Imports
const express = require("express");

const { postProductCreate } = require("../controllers/product");
const { isLoggedin, isAuth, isSeller } = require("../controllers/auth");
const { userById } = require("../controllers/user");


  // Initialise
const router = express.Router();

// Routes for /api/product
router.param("userId", userById);
router.post("/create/:userId",  isLoggedin, 
                                isAuth, 
                                isSeller, 
                                postProductCreate);
// validation NOT done here, but in controller
module.exports = router;
