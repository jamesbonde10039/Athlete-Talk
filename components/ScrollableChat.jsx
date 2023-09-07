import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import AuthContext from '../store/auth-context';
import { useContext, useEffect } from 'react';
// import { io } from 'socket.io-client';

// const ENDPOINT = `http://localhost:3000/api/socket`;
// var socket = io(),
//   selectedChatCompare;
const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return 'auto';
};

const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

const ScrollableChat = ({ messages }) => {
  // console.log(messages);
  //   useEffect(() => {
  //     socketInitializer();

  //     return () => {
  //       if (socket) {
  //         socket.disconnect();
  //       }
  //     };
  //   }, []);
  const authContext = useContext(AuthContext);
  const user = authContext.user;
  //   const [socketConnected, setSocketConnected] = useState(false);

  //   async function socketInitializer() {
  //     console.log('creating socket connection');
  //     await fetch('/api/socket');

  //     socket = io();
  //     socket.emit('setup', user);
  //   }

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <Box sx={{ display: 'flex' }} key={m._id}>
              {(isSameSender(messages, m, i, authContext.user._id) ||
                isLastMessage(messages, i, authContext.user._id)) && (
                <Tooltip title={m.sender.name} arrow>
                  <Avatar
                    sx={styles.avatar}
                    src={
                      m.sender.imageUrl
                        ? m.sender.imageUrl
                        : `https://api.dicebear.com/6.x/micah/svg?seed=${m.sender?.name}+`
                    }
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? '#bee3f8' : '#b9f5d0'
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  maxWidth: '75%',
                }}
              >
                {m.content}
              </span>
            </Box>
          );
        })}
      <br></br>
    </ScrollableFeed>
  );
};

/** @type {import("@mui/material").SxProps} */
const styles = {
  avatorContainer: {
    display: 'flex',
    alignItems: 'center',
    my: 5,
    flexDirection: 'column',
  },
  avatar: {
    width: '40px',
    height: '40px',
    // borderRadius: 0,
  },
  yourChannel: {
    mt: 1,
  },
};

export default ScrollableChat;
