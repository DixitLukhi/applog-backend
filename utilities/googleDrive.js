require("dotenv").config();

const stream = require("stream");
const path = require("path");
const { google } = require('googleapis');

// const KEYFILEPATH = path.join(__dirname, './googleDrive.json');
// const KEYFILEPATH = path.join(__dirname, './applogKey.json');
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    credentials: {
        type: process.env.GOOGLE_DRIVE_TYPE,
        project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_DRIVE_AUTH_URI,
        token_uri: process.env.GOOGLE_DRIVE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_DRIVE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_DRIVE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_DRIVE_UNIVERSE_DOMAIN
    },
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

async function saveToDrive(file, fileSize, mimeType, originalName, parent = []) {
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
                onUploadProgress: (evt) => {
                    const progress = (evt.bytesRead / fileSize / 1048576) * 100;
                },
            },
            (err, res) => {
                if (err) {
                    reject(new Error(`An error occurred while uploading the file: ${err.message}`));
                } else {
                    resolve({ msg: 'File uploaded successfully', data: res.data });
                }
            }
        );
    });
}

async function deleteFromDrive(fileKey) {
    return new Promise((resolve, reject) => {
        drive.files.delete(
            {
                fileId: fileKey,
            },
            (err, data) => {
                if (err) {
                    reject(new Error(`An error occurred while deleting the file: ${err.message}`));
                } else {
                    resolve({ msg: "File deleted successfully", data: data });
                }
            }
        );
    });
}

module.exports = { saveToDrive, deleteFromDrive };
