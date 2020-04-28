// Imports
const express = require("express");

const { productById, postProductCreate, getReadProduct, putProductUpdate, deleteProduct, deactivateProduct } = require("../controllers/product");
const { isLoggedin, isAuth, isSeller } = require("../controllers/auth");
const { userById } = require("../controllers/user");


  // Initialise
const router = express.Router();

// Routes for /api/product
router.param("userId", userById);
router.param("productId", productById);
router.post("/create/:userId",  isLoggedin, 
                                isAuth, 
                                isSeller, 
                                postProductCreate);
// validation NOT done here, but in controller

router.get("/read/:productId/:userId", getReadProduct);

router.put("/update/:productId/:userId", isLoggedin, isAuth, isSeller, putProductUpdate);

router.delete("/delete/:productId/:userId", isLoggedin, isAuth, isSeller, deleteProduct);
router.put("/deactivate/:productId/:userId", isLoggedin, isAuth, isSeller, deactivateProduct);

module.exports = router;
