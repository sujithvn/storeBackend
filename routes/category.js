// Imports
const express = require("express");

const { categoryCreateValidator } = require("../middlewares/validator");
const { postCategoryCreate } = require("../controllers/category");
const { isLoggedin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");


  // Initialise
const router = express.Router();

// Routes for /api/category
router.param("userId", userById);
router.post("/create/:userId",  categoryCreateValidator, 
                                isLoggedin, 
                                isAuth, 
                                isAdmin, 
                                postCategoryCreate);

module.exports = router;
