const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { User } = require("../models/user");
const helper = require("../utilities/helper");
const responseManager = require("../utilities/responseManager");
const { transporter } = require("../utilities/helper");

exports.signup = async (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { first_name, last_name, email, password } = req.body;
  // const noError =  await responseManager.schemaError(req, res);
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const enc_password = await helper.passwordEncryptor(password);
    const checkExisting = await User.findOne({ email: email }).lean();
    if (checkExisting == null) {
      // const otp = await helper.otpGenerator();
      // const enc_otp = await helper.passwordEncryptor(otp);

      const obj = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: enc_password,
      };

      const data = await User.create(obj);

        return responseManager.onSuccess(
          "User created successfully.",
          {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
          },
          res
        );
    } else {
      return responseManager.badrequest(
          { message: "User already exist." },
          res
        );
      }
  } else {
    return responseManager.schemaError(errors.array()[0].msg, res);
  }
};

exports.signin = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
  );
  res.setHeader("Access-Control-Allow-Methods", "*");
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const userData = await User.findOne({ email: email }).lean();
    if (userData && userData != null) {
        const userPassword = await helper.passwordDecryptor(userData.password);
        if (userPassword == password) {
          const getToken = await helper.generateAccessToken({
            userid: userData._id.toString(),
          });
          
          return responseManager.onSuccess(
            "User login successfully",
            { token: getToken },
            res
          );
        } else {
          return responseManager.badrequest(
            { message: "Invalid credentials" },
            res
          );
        }
      
    } else {
      return responseManager.badrequest(
        { message: "User does not exist." },
        res
      );
    }
    // return responseManager.onSuccess("errors.array()[0].msg", userData, res);
    // return console.log("userData", res.json(userData));
  } else {
    return responseManager.schemaError(errors.array()[0].msg, res);
  }
};

exports.makeAdmin = async (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const userData = await User.findOne({ email }).select("role").lean();
    if (userData && userData != null) {
      await User.findByIdAndUpdate(userData._id, {
        role: 1,
      });
      return responseManager.onSuccess("You are now admin", 1, res);
    } else {
      return responseManager.badrequest(
        { message: "User does not exist" },
        res
      );
    }
  }
  else {
    return responseManager.schemaError(errors.array()[0].msg, res);
  }
};