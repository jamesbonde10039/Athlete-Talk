const nc = require('next-connect');
const authController = require('../../../../../controllers/authController');
const catachAsync = require('../../../../../utils/catchAsync');
const Chat = require('../../../../../models/chatModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.post(
  authController.protect,
  catachAsync(async (req, res, next) => {
    const { chatId, userId } = req.body;

    const addedToChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!addedToChat) {
      res.status(400).json({
        status: 'fail',
        message: 'Chat not found',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          chat: addedToChat,
        },
      });
    }
  })
);

handler.delete(
  authController.protect,
  catachAsync(async (req, res, next) => {
    const { chatId, userId } = req.body;

    const removedToChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removedToChat) {
      res.status(400).json({
        status: 'fail',
        message: 'Chat not found',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          chat: removedToChat,
        },
      });
    }
  })
);

export default handler;
