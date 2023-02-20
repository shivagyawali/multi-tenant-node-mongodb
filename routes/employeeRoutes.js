const express = require("express");
const router = express.Router();
const employeeCtrl = require("../controller/employeeCtrl");

router.get("/", employeeCtrl.getAllEmployee);
router.post("/:tenantId/create", employeeCtrl.create);


module.exports = router;
