const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');
const Message = require('../../../models/messageModel');
const Chat = require('../../../models/chatModel');
const User = require('../../../models/userModel');

const handler = nc({
  onError: authController.onError,
  onNoMatch: authController.onNoMatch,
});

handler.post(
  authController.protect,
  catchAsync(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log('Invalid data passed into request');
      return res.sendStatus(400);
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    try {
      var message = await Message.create(newMessage);

      message = await message.populate('sender', 'name imageUrl');
      message = await message.populate('chat');
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'name email imageUrl',
      });

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });

      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
);

export default handler;
