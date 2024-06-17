const stream = require("stream");
const path = require("path");
const { google } = require('googleapis');
const sharp = require("sharp");

const KEYFILEPATH = path.join(__dirname, './apikeys.json');
const SCOPES = ["https://www.googleapis.com/auth/drive"]; 

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

async function saveToDrive(file, fileSize, mimeType, originalName, parent) {

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file);

    return new Promise((resolve, reject) => {

    drive.files.create(
        {
          media: {
            mimeType: mimeType,
            body: bufferStream,
          },
          requestBody: {
            name: originalName,
            parents: parent,
          },
          fields: 'id',
          supportsAllDrives: true, // Allow resumable uploads for shared drives
        },
        {
          // Use the Axios library to handle resumable uploads
          onUploadProgress: (evt) => {
            const progress = (evt.bytesRead / fileSize / 1048576) * 100;
            // console.log(`Progress: ${progress.toFixed(2)}%`);
          },
        },
        (err, res) => {
            if (err) {
              reject(new Error(`An error occurred while uploading the file: ${err.message}`));
            } else {
              resolve({ msg: 'File uploaded successfully', data: res.data });
            }
          });
    });
}

async function deleteFromDrive(fileKey) {
    let promise = new Promise(function (resolve, reject) {
    
    drive.files.delete({
        fileId: fileKey,
      }, function (err, data) {
        if (err)
          reject(new Error({ msg: "An error occurred while deleting the file" }));
        else resolve({ msg: "file deleted successfully", data: data });
      });
    }); 
    return promise;
  }
  
module.exports = { saveToDrive, deleteFromDrive };
