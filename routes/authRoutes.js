const express = require("express");
const router = express.Router();
const authCtrl = require("../controller/authCtrl");
const checkAuth = require("../middleware/checkAuth");

router.post("/login", authCtrl.login);
router.post("/refresh-token", checkAuth, authCtrl.refreshToken);


module.exports = router;
