import Chat from '../../../../models/chatModel';

const nc = require('next-connect');
const authController = require('../../../../controllers/authController');
const catchAsync = require('../../../../utils/catchAsync');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.post(
  authController.protect,
  catchAsync(async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: 'Users and name are required' });
    }

    if (req.body.users.length < 2) {
      return res
        .status(400)
        .json({ message: 'Users array must have at least 2 users' });
    }

    req.body.users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: req.body.users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json({
      status: 'success',
      data: {
        chat: fullGroupChat,
      },
    });
  })
);

export default handler;
