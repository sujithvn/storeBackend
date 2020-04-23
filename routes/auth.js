// Imports
const express = require("express");

const { test } = require("../controllers/auth");


// Initialise
const router = express.Router();

// Routes for /api/auth
router.get("/test", test);

module.exports = router;
