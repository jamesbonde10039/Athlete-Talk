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
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json({ users });
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

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json({ users });
  })
);
export default handler;
