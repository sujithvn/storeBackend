// Imports
const express = require("express");

const { categoryCreateValidator } = require("../middlewares/validator");
const { categoryById, postCategoryCreate, getReadCategory, putCategoryUpdate, deleteCategory } = require("../controllers/category");
const { isLoggedin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");


  // Initialise
const router = express.Router();

// Routes for /api/category
router.param("userId", userById);

router.param("categoryId", categoryById);

router.post("/create/:userId",  categoryCreateValidator, 
                                isLoggedin, 
                                isAuth, 
                                isAdmin, 
                                postCategoryCreate);

router.get("/read/:categoryId/:userId", getReadCategory);

router.put("/update/:categoryId/:userId", isLoggedin, isAuth, isAdmin, putCategoryUpdate);

router.delete("/delete/:categoryId/:userId", isLoggedin, isAuth, isAdmin, deleteCategory);

module.exports = router;
