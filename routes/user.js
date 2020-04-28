const express = require("express");
const router = express.Router();

const { userById, getUser, putUpdateUser } = require("../controllers/user");
const { isLoggedin, isAuth, isSeller, isAdmin } = require("../controllers/auth");

router.param("userId", userById);

//Testing with a sample router,  #ToDo - remove
router.get("/test/:userId", isLoggedin, isAuth, isSeller, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  });
});

// Routes for /api/user
router.get("/getuser/:userId", isLoggedin, isAuth, getUser);

router.put("/updateuser/:userId", isLoggedin, isAuth, putUpdateUser);

module.exports = router;
