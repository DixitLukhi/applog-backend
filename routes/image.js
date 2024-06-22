const express = require("express");
const router = express.Router();
const fileHelper = require("../utilities/multerFunction");
const helper = require("../utilities/helper");
const multer = require("multer");
const { logoUpload } = require("../controllers/image");

router.post("/logo", helper.isAuthenticated, helper.isAdmin, fileHelper.memoryUpload.single("file"), logoUpload);

module.exports = router;
