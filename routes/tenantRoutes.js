const express = require("express");
const router = express.Router();
const tenantCtrl = require('../controller/tenantCtrl')

router.get("/", tenantCtrl.getAllTenant);
router.post("/create", tenantCtrl.create);
router.delete("/:id", tenantCtrl.destroy);

module.exports = router;