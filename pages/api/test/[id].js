const nc = require('next-connect');
const authController = require('./../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');
import { google } from 'googleapis';
import path from 'path';

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFilename: path.resolve('./driveToken.json'),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  return auth;
};

handler.get(
  catchAsync(async (req, res, next) => {
    const { id } = req.query;

    // console.log(id);
    let auth = await authenticateGoogle();

    const driveService = google.drive({ version: 'v2', auth });

    const response = await driveService.files.get({
      fileId: id,
      fields: 'videoMediaMetadata',
    });

    res.status(200).json({
      status: 'success',
      data: {
        duration: response.data.videoMediaMetadata.durationMillis,
      },
    });
  })
);

export default handler;
