const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const responseManager = require("../utilities/responseManager");
const { default: mongoose } = require("mongoose");
const { User } = require("../models/user");

exports.passwordEncryptor = async (password) => {
  const encLayer1 = CryptoJS.AES.encrypt(
    password,
    process.env.PASSWORD_ENC
  ).toString();
  const encLayer2 = CryptoJS.DES.encrypt(
    encLayer1,
    process.env.PASSWORD_ENC
  ).toString();
  const finalEncPassword = CryptoJS.TripleDES.encrypt(
    encLayer2,
    process.env.PASSWORD_ENC
  ).toString();
  return finalEncPassword;
};

exports.passwordDecryptor = async (password) => {
  const decLayer1 = CryptoJS.TripleDES.decrypt(
    password,
    process.env.PASSWORD_ENC
  );
  var deciphertext1 = decLayer1.toString(CryptoJS.enc.Utf8);
  var decLayer2 = CryptoJS.DES.decrypt(deciphertext1, process.env.PASSWORD_ENC);
  var deciphertext2 = decLayer2.toString(CryptoJS.enc.Utf8);
  const decLayer3 = CryptoJS.AES.decrypt(
    deciphertext2,
    process.env.PASSWORD_ENC
  );
  const finalDecPassword = decLayer3.toString(CryptoJS.enc.Utf8);
  return finalDecPassword;
};

exports.generateAccessToken = async (userData) => {
  return jwt.sign(userData, process.env.LOGIN_SECRET, { expiresIn: "7d" });
};

exports.isAuthenticated = async (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  if (typeof bearerToken !== "undefined") {
    const bearer = bearerToken.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.LOGIN_SECRET, (err, auth) => {
      if (err) {
        return responseManager.unauthorisedRequest(res);
      } else {
        req.token = auth;
      }
    });
    next();
  } else {
    return responseManager.unauthorisedRequest(res);
  }
};

exports.isAdmin = async (req, res, next) => {
  if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
    const userData = await User.findById(req.token.userid)
      .select("role")
      .lean();

      if (userData && userData.role != 1) {
        return responseManager.unauthorisedRequest(res);
      }
      next();
  } else {
    return responseManager.badrequest(
      { message: "Invalid token for admin" },
      res
    );
  }
};