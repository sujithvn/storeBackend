// Imports
const express = require("express");

const { userRegisterValidator } = require("../middlewares/validator");
const { postRegister } = require("../controllers/auth");


// Initialise
const router = express.Router();

// Routes for /api/auth
router.post("/register", userRegisterValidator, postRegister);

module.exports = router;
