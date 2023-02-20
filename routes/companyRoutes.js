const express = require("express");
const router = express.Router();
const companyCtrl = require("../controller/companyCtrl");
const checkAuth = require("../middleware/checkAuth");
const authorize = require("../middleware/checkRole");

router.get("/profile", checkAuth, authorize("company"), companyCtrl.profile);



module.exports = router;
