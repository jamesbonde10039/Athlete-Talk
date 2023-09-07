const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');
const Message = require('../../../models/messageModel');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.query.chatId })
        .populate('sender', 'name email imageUrl')
        .populate('chat');
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
);

export default handler;
