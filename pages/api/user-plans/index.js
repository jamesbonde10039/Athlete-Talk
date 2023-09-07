const nc = require('next-connect');
const catchAsync = require('../../../utils/catchAsync');
const authController = require('./../../../controllers/authController');
const UserPlan = require('../../../models/userPlanModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    const plans = await UserPlan.find({ user: req.user.id }).populate('plan');

    res.status(200).json({
      status: 'success',
      data: {
        plans,
      },
    });
  })
);

handler.post(
  authController.protect,
  catchAsync(async (req, res, next) => {
    const plan = req.body.plan;
    const user = req.user.id;

    const userPlan = await UserPlan.create({
      user,
      plan,
    });

    res.status(200).json({
      status: 'success',
      data: {
        userPlan,
      },
    });
  })
);

export default handler;
