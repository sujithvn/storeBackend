// Imports
const express = require("express");

const { userRegisterValidator, userLoginValidator } = require("../middlewares/validator");
const { postRegister, postLogin, getLogout, isLoggedin } = require("../controllers/auth");


// Initialise
const router = express.Router();

// Routes for /api/auth
router.post("/register", userRegisterValidator, postRegister);
router.post("/login", userLoginValidator, postLogin);
router.get("/logout", getLogout);

//Testing with a sample router,  #ToDo - remove
router.get("/test", isLoggedin, (req, res) => {
    res.json({message: "Passed isLoggedin & Reached auth test successfully"})
});

module.exports = router;
