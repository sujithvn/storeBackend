// Imports
const express = require("express");

const { userRegisterValidator, userLoginValidator } = require("../middlewares/validator");
const { postRegister, postLogin, getLogout } = require("../controllers/auth");


// Initialise
const router = express.Router();

// Routes for /api/auth
router.post("/register", userRegisterValidator, postRegister);
router.post("/login", userLoginValidator, postLogin);
router.get("/logout", getLogout);

module.exports = router;
