const nc = require('next-connect');
const catchAsync = require('../../../../utils/catchAsync');
const authController = require('../../../../controllers/authController');
const Video = require('../../../../models/videoModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    // console.log('hello from the api videos/{id}');
    const { id } = req.query;

    const video = await Video.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        video,
      },
    });
  })
);

export default handler;
