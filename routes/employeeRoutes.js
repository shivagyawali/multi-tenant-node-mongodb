const express = require("express");
const router = express.Router();
const employeeCtrl = require("../controller/employeeCtrl");
const checkAuth = require("../middleware/checkAuth");
const authorize = require("../middleware/checkRole");


router.get("/", employeeCtrl.getAllEmployee);

router.post(
  "/create",
  checkAuth,
  authorize("company"),
  employeeCtrl.create
);
    

module.exports = router;
