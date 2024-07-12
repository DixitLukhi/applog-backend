const express = require("express");
const router = express.Router();
const fileHelper = require("../utilities/multerFunction");
const helper = require("../utilities/helper");
const multer = require("multer");
const { logoUpload, proofUpload } = require("../controllers/image");

router.post("/logo", helper.isAuthenticated, helper.isAdmin, fileHelper.memoryUpload.single("file"), logoUpload);

router.post("/proof", helper.isAuthenticated, helper.isAdmin, fileHelper.memoryUpload.single("file"), proofUpload);

module.exports = router;
