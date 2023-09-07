import User from '../../../models/userModel';

const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');
const Plan = require('../../../models/planModel');
const UserPlan = require('../../../models/userPlanModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    //fetch plans for given user
    const userPlansP = UserPlan.find({ user: req.user._id })
      .populate('plan')
      .populate('user');

    const userCategoriesP = User.find({ _id: req.user._id })
      .select('preferredCategories')
      .populate('preferredCategories');

    const [userPlans, userCategories] = await Promise.all([
      userPlansP,
      userCategoriesP,
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        userPlans,
        userCategories,
      },
    });
  })
);

export default handler;
