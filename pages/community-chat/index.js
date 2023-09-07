import { Grid } from '@mui/material';
import MyChats from '../../components/MyChats';
import ChatBox from '../../components/ChatBox';
import { useState } from 'react';

const CommunityChat = ({ chats }) => {
  // console.log(chats);
  const [activeChatBox, setActiveChatBox] = useState({});
  const [allChats, setAllChats] = useState(chats);

  return (
    <>
      <Grid sx={{ height: '100%' }} container>
        <Grid item xs={3}>
          <MyChats
            chats={allChats}
            activeChatBox={activeChatBox}
            setActiveChatBox={setActiveChatBox}
            setAllChats={setAllChats}
          />
        </Grid>
        <Grid item xs={9}>
          <ChatBox selectedChat={activeChatBox} chats={{}} />
        </Grid>
      </Grid>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;

  if (!req.cookies.jwt) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const chat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });

    if (!chat.ok) {
      throw new Error('something went wrong');
    }

    const chatData = await chat.json();

    return {
      props: {
        chats: chatData.data.chats,
      },
    };
  } catch (error) {
    console.log(error);
  }
  return {
    props: {},
  };
}

export default CommunityChat;
