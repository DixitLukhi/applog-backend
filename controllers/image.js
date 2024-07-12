const mongoose = require("mongoose");
const responseManager = require("../utilities/responseManager");
const allowedContentTypes = require("../utilities/contentTypes");
var fs = require("fs");
const sharp = require("sharp");
const outputFilePath = "./images/output.webp";
const { saveToDrive } = require("../utilities/googleDrive");

exports.logoUpload = async (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        if (req.file) {
          if (allowedContentTypes.imagearray.includes(req.file.mimetype)) {
            const fileSize = parseFloat(parseFloat(req.file.size) / 1048576);
            if (fileSize <= 2) {
              sharp(req.file.buffer)
                .webp()
                .toFile(outputFilePath, (err) => {
                  if (err) {
                    console.error("Image conversion failed:", err);
                    return;
                  }
                  
                  const webpBuffer = fs.readFileSync(outputFilePath);
                  saveToDrive(
                    webpBuffer,
                    fileSize,
                    "image/webp",
                    req.file.originalname,
                    ["10hatStNLM-3kFOWK8Qbe0ee0zBroU8mw"]
                  )
                    .then((result) => {
                      return responseManager.onSuccess(
                        "App Logo uploaded successfully!",
                        {
                          url: result.data.id,
                        },
                        res
                      );
                    })
                    .catch((error) => {
                      return responseManager.onError(error, res);
                    });
                });
            } else {
              return responseManager.badrequest(
                { message: "Image should be <= 2 MB" },
                res
              );
            }
          } else {
            return responseManager.badrequest(
              { message: "Invalid file type" },
              res
            );
          }
        } else {
          return responseManager.badrequest(
            { message: "Invalid file type" },
            res
          );
        }
    } else {
      return responseManager.badrequest(
        { message: "Invalid token to upload image" },
        res
      );
    }
  };

  exports.proofUpload = async (req, res) => {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Origin", "*");
      if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
          if (req.file) {
            if (allowedContentTypes.imagearray.includes(req.file.mimetype)) {
              const fileSize = parseFloat(parseFloat(req.file.size) / 1048576);
              if (fileSize <= 2) {
                sharp(req.file.buffer)
                  .webp()
                  .toFile(outputFilePath, (err) => {
                    if (err) {
                      console.error("Image conversion failed:", err);
                      return;
                    }
                    
                    const webpBuffer = fs.readFileSync(outputFilePath);
                    saveToDrive(
                      webpBuffer,
                      fileSize,
                      "image/webp",
                      req.file.originalname,
                      ["1RXazQStXH74UEUqPtKTVqyy9OfkjfdFv"]
                    )
                      .then((result) => {
                        return responseManager.onSuccess(
                          "App Logo uploaded successfully!",
                          {
                            url: result.data.id,
                          },
                          res
                        );
                      })
                      .catch((error) => {
                        return responseManager.onError(error, res);
                      });
                  });
              } else {
                return responseManager.badrequest(
                  { message: "Image should be <= 2 MB" },
                  res
                );
              }
            } else {
              return responseManager.badrequest(
                { message: "Invalid file type" },
                res
              );
            }
          } else {
            return responseManager.badrequest(
              { message: "Invalid file type" },
              res
            );
          }
      } else {
        return responseManager.badrequest(
          { message: "Invalid token to upload image" },
          res
        );
      }
    };