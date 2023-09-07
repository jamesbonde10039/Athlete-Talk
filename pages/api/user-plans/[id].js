const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');
const UserPlan = require('../../../models/userPlanModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    const { id } = req.query;

    const userPlan = await UserPlan.findOne({
      user: req.user.id,
      plan: id,
    });

    const currentDayVideos = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plans/${id}?day=${userPlan.progress}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
        },
      }
    );

    const currentDayVideosData = await currentDayVideos.json();

    res.status(200).json({
      status: 'success',
      data: {
        videos: currentDayVideosData.data.videos,
        day: userPlan.progress,
      },
    });
  })
);

export default handler;
