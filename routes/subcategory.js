// Imports
const express = require("express");

const { subCategoryCreateValidator } = require("../middlewares/validator");
const { subcategoryById, postSubCategoryCreate, getReadSubCategory, putSubCategoryUpdate, deleteSubCategory } = require("../controllers/subcategory");
const { isLoggedin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");


  // Initialise
const router = express.Router();

// Routes for /api/subcategory
router.param("userId", userById);

router.param("subcategoryId", subcategoryById);

router.post("/create/:userId",  subCategoryCreateValidator, 
                                isLoggedin, 
                                isAuth, 
                                isAdmin, 
                                postSubCategoryCreate);

router.get("/read/:subcategoryId/:userId", getReadSubCategory);

router.put("/update/:subcategoryId/:userId", isLoggedin, isAuth, isAdmin, putSubCategoryUpdate);

router.delete("/delete/:subcategoryId/:userId", isLoggedin, isAuth, isAdmin, deleteSubCategory);
                                                                
module.exports = router;
