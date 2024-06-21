const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const helper = require("../utilities/helper");
const { addApp, getOneApp, listApps, removeApp } = require("../controllers/apps");

const appValidation = [
  check("appid")
    .trim(),
  check("appName")
    .notEmpty()
    .withMessage("App Name is required")
    .trim()
    .isLength({isMin: 2, isMax: 40})
    .withMessage("App Name should be less than 40 character"),
  check("appLogo")
    .notEmpty()
    .withMessage("App Logo is required"),
    check("guidelines")
];

router.post("/app", helper.isAuthenticated, helper.isAdmin, appValidation, addApp);

router.get("/allapp", listApps);
router.get("/app", getOneApp);

router.post("/removeapp", helper.isAuthenticated, helper.isAdmin, removeApp);

module.exports = router;
