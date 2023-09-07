const nc = require('next-connect');
import User from '../../../models/userModel';
import catchAsync from '../../../utils/catchAsync';
const authController = require('../../../controllers/authController');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    res.status(200).json({ user: req.user });
  })
);

handler.patch(
  authController.protect,
  catchAsync(async (req, res, next) => {
    const { name, email, imageUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, imageUrl },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ user });
  })
);

export default handler;
