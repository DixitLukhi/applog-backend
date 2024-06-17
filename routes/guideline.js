const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const helper = require("../utilities/helper");
const { listGuideline, removeGuideline, addGuideline } = require("../controllers/guideline");

const policyValidation = [
  check("guidelineid")
    .trim(),
  check("policyid")
    .notEmpty()
    .withMessage("Policy id is required")
    .trim()
    .isLength(5)
    .withMessage("Policy id should be of 5 character"),
  check("policy")
    .notEmpty()
    .withMessage("Policy is required")
    .trim()
];

router.post("/guideline", helper.isAuthenticated, helper.isAdmin, policyValidation, addGuideline);

router.get("/guideline",listGuideline);

router.post("/removeguideline", helper.isAuthenticated, helper.isAdmin, removeGuideline);

module.exports = router;
