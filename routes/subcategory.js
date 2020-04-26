// Imports
const express = require("express");

const { subCategoryCreateValidator } = require("../middlewares/validator");
const { postSubCategoryCreate } = require("../controllers/subcategory");
const { isLoggedin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");


  // Initialise
const router = express.Router();

// Routes for /api/subcategory
router.param("userId", userById);
router.post("/create/:userId",  subCategoryCreateValidator, 
                                isLoggedin, 
                                isAuth, 
                                isAdmin, 
                                postSubCategoryCreate);

module.exports = router;
