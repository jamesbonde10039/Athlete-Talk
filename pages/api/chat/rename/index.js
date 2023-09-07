import Chat from '../../../../models/chatModel';

const nc = require('next-connect');
const authController = require('../../../../controllers/authController');
const catchAsync = require('../../../../utils/catchAsync');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.put(
  authController.protect,
  catchAsync(async (req, res, next) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      res.status(400).json({
        status: 'fail',
        message: 'Chat not found',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          chat: updatedChat,
        },
      });
    }
  })
);

export default handler;
