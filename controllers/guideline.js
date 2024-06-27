const mongoose = require("mongoose");
const responseManager = require("../utilities/responseManager");
const { validationResult } = require("express-validator");
const { User } = require("../models/user");
const Guideline = require("../models/guideline");

exports.addGuideline = async (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { guidelineid, policyid, policy, priority } = req.body;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    if (guidelineid && guidelineid != "" && mongoose.Types.ObjectId.isValid(guidelineid)) {
      const obj = {
        policyid: policyid,
        policy: policy,
        priority: priority
      }
      await Guideline.findByIdAndUpdate(guidelineid, obj);
      
      return responseManager.onSuccess("Guideline updated", 1, res);
    } else {
    const policyData = await Guideline.findOne({ policyid: policyid }).lean();

    if (policyData && policyData != null) {
      return responseManager.badrequest(
        { message: "Policy id should be unique" },
        res
      );
    } else {
      const obj = {
        policyid: policyid,
        policy: policy,
        priority: priority
      }
      await Guideline.create(obj);
      
      return responseManager.onSuccess("Guideline added", 1, res);
    }
      
    }
  } else {
    return responseManager.schemaError(errors.array()[0].msg, res);
  }
};

exports.listGuideline = async (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Origin", "*");
    const { page, limit } = req.query;
    const p = Number(page) ? Number(page) : 1;
    const l = Number(limit) ? Number(limit) : 10;

      // Guideline.countDocuments()
      //   .then((totalRecords) => {
      //     return (
            Guideline.find()
              // .sort({ _id: -1 })
              // .skip((p - 1) * l)
              // .limit(l)
              // .select("-password -otp -createdAt -updatedAt -__v")
              .lean()
              .then((guidelineList) => {
                return responseManager.onSuccess(
                  "GuidelineList list",
                  guidelineList,
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

exports.removeGuideline = async (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { guidelineid } = req.body;

      if (
        guidelineid &&
        guidelineid != "" &&
        mongoose.Types.ObjectId.isValid(guidelineid)
      ) {
        await Guideline.findByIdAndDelete(guidelineid);
        return responseManager.onSuccess(
          "Guideline removed successfully",
          1,
          res
        );
      } else {
        return responseManager.badrequest(
          { message: "Invalid guidelineid to remove guideline" },
          res
        );
      }
};
 