const express = require("express");
const router = express.Router();
const riskAllocationController = require("../controllers/riskAllocationController");

router.get("/:policyId", riskAllocationController.getAllocationByPolicy);

module.exports = router;
