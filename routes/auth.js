const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signup, signin, makeAdmin, getUser, getAllUser } = require("../controllers/auth");
const helper = require("../utilities/helper");

const signUpValidation = [
  check("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ max: 40 })
    .withMessage("First name should be less than 40 character"),
  check("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .isLength({ max: 40 })
    .withMessage("Last name should be less than 40 character"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Email is not correct"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Password should contain at least 3 character"),
];

const signInValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Email is not correct"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Password should contain at least 3 character"),
];

const adminValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Email is not correct"),
    check("role")
    .notEmpty()
    .withMessage("ROle id required")
    .trim()
];

router.post("/signup", signUpValidation, signup);

router.post("/signin", signInValidation, signin);

router.get("/user", helper.isAuthenticated, getUser);

router.get("/alluser", helper.isAuthenticated, helper.isAdmin, getAllUser);

router.post("/admin", adminValidation, helper.isAuthenticated, helper.isAdmin, makeAdmin);

module.exports = router;
