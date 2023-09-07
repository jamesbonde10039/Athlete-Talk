import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket already setup');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    socket.on('setup', (user) => {
      console.log('Setting up user: ' + user.name + ' with id: ' + user._id);
      socket.join(user._id);
      socket.emit('connection');
    });

    socket.on('join chat', (room) => {
      socket.join(room);
      console.log('Joined room: ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessage) => {
      var chat = newMessage.chat;

      if (!chat.users) return console.log('Chat.users not defined');

      chat.users.forEach((user) => {
        if (user._id === newMessage.sender._id) return;

        socket.in(user._id).emit('message received', newMessage);
      });
    });
  });

  console.log('Setting socket');
  res.end();
}
