import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { Logout, Notifications, Settings } from '@mui/icons-material';
import { useProSidebar } from 'react-pro-sidebar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../store/auth-context';
import Head from 'next/head';

const AppHeader = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  let loggedIn = authCtx.isLoggedIn;

  const { collapseSidebar, toggleSidebar, broken } = useProSidebar();
  const handleLogout = (e) => {
    e.preventDefault();

    authCtx.logout();
    router.push('/login');
  };

  return (
    <>
      <AppBar position="sticky" sx={styles.appBar}>
        <Toolbar>
          {loggedIn && (
            <IconButton
              onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
              color="secondary"
            >
              <MenuTwoToneIcon />
            </IconButton>
          )}
          <Box component="img" sx={styles.appLogo} src="/logo.svg" />
          <Box sx={{ flexGrow: 1 }} />

          {loggedIn && (
            <>
              <IconButton
                onClick={(e) => {
                  router.push('/profile');
                }}
                title="Settings"
                color="secondary"
              >
                <Settings />
              </IconButton>
              <IconButton
                onClick={handleLogout}
                title="Sign Out"
                color="secondary"
              >
                <Logout />
              </IconButton>
            </>
          )}

          {!loggedIn && (
            <>
              <Link href={'/login'}>
                <Typography sx={{ mr: 3 }} variant="button" color="secondary">
                  Login
                </Typography>
              </Link>
              <Link href={'/signup'}>
                <Typography variant="button" color="secondary">
                  Signup
                </Typography>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

/** @type {import("@mui/material").SxProps} */
const styles = {
  appBar: {
    bgcolor: '#34495e',
    zIndex: 1,
    boxShadow: 'none',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  appLogo: {
    ml: 1,
    width: 40,
    cursor: 'pointer',
  },
};

export default AppHeader;
