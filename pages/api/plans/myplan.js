const nc = require('next-connect');
const catchAsync = require('../../../utils/catchAsync');
const authController = require('./../../../controllers/authController');
const Plan = require('../../../models/planModel');
const UserPlan = require('../../../models/userPlanModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.post(
  authController.protect,
  catchAsync(async (req, res, next) => {
    console.log('coming to backend api');
    const { day, planID, timeTaken } = req.body;

    const plan = await Plan.findById(planID);

    if (!plan) {
      return next(new AppError('No plan found with that ID', 404));
    }

    await UserPlan.findOneAndUpdate(
      {
        user: req.user.id,
        plan: planID,
      },
      {
        progress: +day + 1,
      }
    );

    const idealTime = plan.duration[day];

    let score;
    const diff = Math.abs(idealTime - timeTaken);
    if (diff < plan.videos[day].length * 1000) {
      score = 100;
    } else {
      score = 100 - (diff / idealTime) * 100;
    }

    res.status(200).json({
      status: 'success',
      data: {
        score,
      },
    });
  })
);

export default handler;
