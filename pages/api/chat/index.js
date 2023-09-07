const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');
const Chat = require('../../../models/chatModel');
const User = require('../../../models/userModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.post(
  authController.protect,
  catchAsync(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
      console.log('UserId param not sent with request');
      return res
        .status(400)
        .json({ message: 'UserId param not sent with request' });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
    });

    if (isChat.length > 0) {
      res.status(200).json({
        status: 'success',
        data: {
          chat: isChat[0],
        },
      });
    } else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );

      res.status(200).json({
        status: 'success',
        data: {
          chat: fullChat,
        },
      });
    }
  })
);

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
    });

    res.status(200).json({
      status: 'success',
      data: {
        chats,
      },
    });
  })
);

export default handler;
