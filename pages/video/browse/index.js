import React, { useEffect } from 'react';
const { server } = require('./../../../utils/server');
import VideoCard from '../../../components/VideoCard';
import { Box, Grid } from '@mui/material';

const BrowseVideos = ({ videos, preferredCategories }) => {
  console.log(videos);
  const videosSortedByPreferredCategories = videos.sort((a, b) => {
    const aCategory = a.categories;
    const bCategory = b.categories;
    let presentA = false;
    let presentB = false;
    for (let i = 0; i < preferredCategories.length; i++) {
      if (
        aCategory.some((category) => category._id === preferredCategories[i])
      ) {
        presentA = true;
      }
      if (
        bCategory.some((category) => category._id === preferredCategories[i])
      ) {
        presentB = true;
      }
    }
    if (!presentA && !presentB) {
      return 0;
    }
    if (!presentA) {
      return 1;
    }
    if (!presentB) {
      return -1;
    }
    return 0;
  });
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
      }}
    >
      {videosSortedByPreferredCategories &&
        videosSortedByPreferredCategories.length !== 0 &&
        videosSortedByPreferredCategories.map((video, idx) => (
          <Box
            key={idx}
            sx={{
              m: 1,
              width: 350,
              height: 450,
            }}
          >
            <VideoCard details={video} />
          </Box>
        ))}
    </Box>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;

  //Checking if there is a cookie of jwt token
  if (!req.cookies.jwt)
    return { redirect: { destination: '/login', permanent: false } };

  try {
    const response = await fetch(`${server}/api/videos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        props: {
          videos: data.data.videos,
          preferredCategories: data.data.preferredCategories,
        },
      };
    } else {
      throw new Error('something went wrong!');
    }
  } catch (err) {
    console.log(err);
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { redirect: { destination: '/login', permanent: false } };
}

export default BrowseVideos;
