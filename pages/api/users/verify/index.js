const nc = require('next-connect');
const authController = require('./../../../../controllers/authController');

const handler = nc();

handler.use(authController.protect).get((req, res) => {
  res.json({ user: req.user });
});

export default handler;
