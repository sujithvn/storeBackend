// Imports
const express = require("express");

const { postRegister } = require("../controllers/auth");


// Initialise
const router = express.Router();

// Routes for /api/auth
router.post("/register", postRegister);

module.exports = router;
