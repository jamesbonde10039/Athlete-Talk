const nc = require('next-connect');
const dbConnect = require('./../../../../lib/mongoose');
const User = require('./../../../../models/userModel');
const authController = require('./../../../../controllers/authController');
const AppError = require('./../../../../utils/appError');
const catchAsync = require('./../../../../utils/catchAsync');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.post(
  catchAsync(async (req, res, next) => {
    await dbConnect();

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    authController.createSendToken(newUser, 201, res);
  })
);

export default handler;
