const mongoose = require("mongoose");
const responseManager = require("../utilities/responseManager");
const { validationResult } = require("express-validator");
const App = require("../models/apps");

exports.addApp = async (req, res) => {
  const { appid, appName, appLogo, guidelines } = req.body;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    if (appid && appid != "" && mongoose.Types.ObjectId.isValid(appid)) {
      const obj = {
        appName: appName,
        appLogo: appLogo,
        guidelines: guidelines
      }
      await App.findByIdAndUpdate(appid, obj);
      
      return responseManager.onSuccess("App Info updated", 1, res);
    } else {
      const obj = {
        appName: appName,
        appLogo: appLogo,
        guidelines: guidelines
      }
      await App.create(obj);
      
      return responseManager.onSuccess("App added", 1, res);
      
    }
  } else {
    return responseManager.schemaError(errors.array()[0].msg, res);
  }
};

exports.listApps = async (req, res) => {
    const { page, limit } = req.query;
    const p = Number(page) ? Number(page) : 1;
    const l = Number(limit) ? Number(limit) : 10;

      // Guideline.countDocuments()
      //   .then((totalRecords) => {
      //     return (
            App.find()
              // .sort({ _id: -1 })
              // .skip((p - 1) * l)
              // .limit(l)
              // .select("-password -otp -createdAt -updatedAt -__v")
              .lean()
              .then((appList) => {
                return responseManager.onSuccess(
                  "App list",
                  { list: appList
                    // , total: totalRecords 
                  },
                  res
                );
              })
              .catch((error) => {
                return responseManager.onError(error, res);
              })
          // );
        // })
        // .catch((error) => {
        //   return responseManager.onError(error, res);
        // });
};

exports.getOneApp = async (req, res) => {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Origin", "*");
  
    const { appid } = req.query;
    if (
        appid &&
        appid != "" &&
      mongoose.Types.ObjectId.isValid(appid)
    ) {
      const appData = await App.findById(appid)
        .select("-createdAt -updatedAt -__v")
        .lean();
      
        if (appData && appData != null) {
        return responseManager.onSuccess("App data", appData, res);
      } else {
        return responseManager.badrequest({ message: "Invalid appid" }, res);
      }
    } else {
      return responseManager.badrequest({ message: "Invalid appid" }, res);
    }
  };

exports.removeApp = async (req, res) => {
    const { appid } = req.body;
  
        if (
          appid &&
          appid != "" &&
          mongoose.Types.ObjectId.isValid(appid)
        ) {
          await App.findByIdAndDelete(appid);
          return responseManager.onSuccess(
            "App removed successfully",
            1,
            res
          );
        } else {
          return responseManager.badrequest(
            { message: "Invalid appid to remove app" },
            res
          );
        }
  };