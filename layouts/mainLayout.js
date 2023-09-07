import React from 'react';
import { Box } from '@mui/material';
import AppHeader from './../components/AppHeader';
import SideNav from '../components/SideNav';

const MainLayout = (props) => {
  return (
    <>
      <AppHeader />
      <Box sx={styles.container}>
        <SideNav />
        <Box component="main" sx={styles.mainSection}>
          {props.children}
        </Box>
      </Box>
    </>
  );
};

/** @type {import('@mui/material').SxProps} */
const styles = {
  container: {
    display: 'flex',
    bgcolor: 'neutral.light',
    height: 'calc( 100% - 64px )',
  },
  mainSection: {
    p: 1,
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
};

export default MainLayout;
