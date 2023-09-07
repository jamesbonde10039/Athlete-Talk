import User from '../../../models/userModel';

const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');

const handler = nc({
  onError: authController.onError,
  onNoMatch: authController.onNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res) => {
    const userCategories = await req.user.populate('preferredCategories');

    res.status(200).json({
      status: 'success',
      data: {
        userCategories: userCategories.preferredCategories,
      },
    });
  })
);

handler.patch(
  authController.protect,
  catchAsync(async (req, res) => {
    const updatedPreferredCategories = req.body.preferredCategories;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { preferredCategories: updatedPreferredCategories },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  })
);

export default handler;
