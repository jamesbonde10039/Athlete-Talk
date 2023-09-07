import {
  AnalyticsOutlined,
  DashboardOutlined,
  SourceOutlined,
  StyleOutlined,
} from '@mui/icons-material';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import AuthContext from '../store/auth-context';

let collapsed;

const SideNav = (props) => {
  const theme = useTheme();
  const router = useRouter();
  const authCtx = useContext(AuthContext);

  const user = Object.keys(authCtx.user).length > 0 ? authCtx.user : null;
  // console.log(router.pathname);

  let tag = 'User🙂';
  if (user && user.role === 'admin') {
    tag = 'Admin😎';
  } else if (user && user.role === 'coach') {
    tag = 'Coach 🧙🏼‍♂️';
  }

  const { collapsed } = useProSidebar();
  return (
    <Sidebar
      style={{
        height: '100%',
        top: 'auto',
      }}
      breakPoint="md"
      backgroundColor={theme.palette.neutral.light}
    >
      <Box sx={styles.avatorContainer}>
        <Avatar
          sx={{
            width: collapsed ? '40px' : '150px',
            height: collapsed ? '40px' : '150px',
            transition: '0.3s',
          }}
          alt="Channel Name"
          src={
            user && user.imageUrl
              ? user.imageUrl
              : `https://api.dicebear.com/6.x/micah/svg?seed=${user?.name}+`
          }
        />
        {!collapsed && (
          <Typography variant="body2" sx={styles.yourChannel}>
            {user ? user.name.toUpperCase() : ' '}
          </Typography>
        )}
        {!collapsed && <Typography variant="overline">{tag}</Typography>}
      </Box>
      <Menu
        menuItemStyles={{
          button: ({ active }) => {
            return {
              background: active
                ? ' linear-gradient(to right, #c5a5fe,#9256fd); '
                : undefined,
              color: active ? '#fff' : undefined,
              borderTopRightRadius: '25px',
              borderBottomRightRadius: '25px',
              '&:hover': {
                background: 'linear-gradient(to right, #c5a5fe,#9256fd);',
                color: '#fff',
                borderTopRightRadius: '25px',
                borderBottomRightRadius: '25px',
              },
            };
          },
        }}
      >
        <MenuItem
          active={router.pathname === '/dashboard'}
          component={<Link href="/dashboard" />}
          icon={<DashboardOutlined />}
        >
          <Typography variant="body2">Dashboard</Typography>
        </MenuItem>
        {user && user.role !== 'user' && (
          <MenuItem
            active={router.pathname === '/video/upload'}
            component={<Link href="/video/upload" />}
            icon={<SourceOutlined />}
          >
            <Typography variant="body2">Upload Video</Typography>
          </MenuItem>
        )}
        {user && user.role !== 'user' && (
          <MenuItem
            active={router.pathname === '/plans/create'}
            component={<Link href="/plans/create" />}
            icon={<AnalyticsOutlined />}
          >
            <Typography variant="body2">Create Plan</Typography>
          </MenuItem>
        )}
        <MenuItem
          active={router.pathname === '/plans/browse'}
          component={<Link href="/plans/browse" />}
          icon={<AnalyticsOutlined />}
        >
          <Typography variant="body2">Browse Plans</Typography>
        </MenuItem>
        <MenuItem
          active={router.pathname === '/plans/myplan'}
          component={<Link href="/plans/myplan" />}
          icon={<AnalyticsOutlined />}
        >
          <Typography variant="body2">My Plans</Typography>
        </MenuItem>
        <MenuItem
          active={router.pathname === '/video/browse'}
          component={<Link href="/video/browse" />}
          icon={<AnalyticsOutlined />}
        >
          <Typography variant="body2">Browse Videos</Typography>
        </MenuItem>
        <MenuItem
          active={router.pathname === '/community-chat'}
          component={<Link href="/community-chat" />}
          icon={<StyleOutlined />}
        >
          <Typography variant="body2">Community Chat</Typography>
        </MenuItem>
      </Menu>
    </Sidebar>
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
  yourChannel: {
    mt: 1,
  },
};

export default SideNav;
