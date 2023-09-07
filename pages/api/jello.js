const nc = require('next-connect');
const dbConnect = require('./../../lib/mongoose');
const User = require('./../../models/userModel');

const handler = nc();
handler.get(async (req, res) => {
  await dbConnect();

  const users = await User.find({});

  res.status(200).json({ users });
});

export default handler;
