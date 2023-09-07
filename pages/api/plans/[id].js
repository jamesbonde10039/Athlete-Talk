import Video from '../../../models/videoModel';

const nc = require('next-connect');
const catchAsync = require('../../../utils/catchAsync');
const authController = require('./../../../controllers/authController');
const Plan = require('../../../models/planModel');
const UserPlan = require('../../../models/userPlanModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    const { id, day } = req.query;

    if (day !== undefined) {
      await getVideosByDay(id, day, req, res);
      return;
    }

    await getAllVideos(id, req, res);
  })
);

export default handler;
async function getAllVideos(id, req, res) {
  const plan = await Plan.findById(id)
    .populate('creator')
    .populate('categories');

  let allVideoIds = plan.videos[0];
  for (let i = 1; i < plan.videos.length; i++) {
    allVideoIds = allVideoIds.concat(plan.videos[i]);
  }

  const uniqueVideoIds = [...new Set(allVideoIds)];
  const uniqueVideos = await Video.find({ _id: { $in: uniqueVideoIds } });
  let videoData = Object.assign(plan.videos);
  let finalVideoData = [];
  for (let i = 0; i < videoData.length; i++) {
    const tmp = [];
    videoData[i] = videoData[i].map((videoId) => {
      const x = uniqueVideos.find((video) => video.id === videoId.toString());
      tmp.push(x);
      return x;
    });
    finalVideoData.push(tmp);
  }

  const userPlan = await UserPlan.findOne({
    user: req.user.id,
    plan: plan._id,
  });

  res.status(200).json({
    status: 'success',
    data: {
      plan,
      planVideos: finalVideoData,
      taken: userPlan !== null,
    },
  });
}

async function getVideosByDay(id, day, req, res) {
  const plan = await Plan.findById(id)
    .populate('creator')
    .populate('categories');

  const videoIds = plan.videos[day];
  const videos = await Video.find({ _id: { $in: videoIds } });

  res.status(200).json({
    status: 'success',
    data: {
      videos,
    },
  });
}
