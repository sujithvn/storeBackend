const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user");
const { isLoggedin, isAuth, isSeller, isAdmin } = require("../controllers/auth");

router.param("userId", userById);

//Testing with a sample router,  #ToDo - remove
router.get("/test/:userId", isLoggedin, isAuth, isSeller, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  });
});


module.exports = router;
