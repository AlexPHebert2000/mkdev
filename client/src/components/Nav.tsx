import React, { ReactElement, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import axios from 'axios';
import { useTheme } from '@mui/material';
import io from 'socket.io-client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/Inbox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';

const socket = io('http://localhost:4000');

const Nav = (): ReactElement => {
  const user = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadMsgs, setUnreadMsgs] = useState<React.ReactNode>(0);
  const [isHidden, setIsHidden] = useState<boolean | undefined>(true)
  const open = !!anchorEl;
  const navigate = useNavigate();
  const theme = useTheme().palette.mode;

  // count total unread messages for logged in user
  useEffect(() => {
    axios
      .get(`/api/users/unread/${user.id}`)
      .then(({ data }): void => {
        if (data > 0) {
          setIsHidden(false);
        }
        setUnreadMsgs(data);
      })
  }, [unreadMsgs])

  socket.on('read-message', () => {
    setUnreadMsgs(0);
  })

  socket.on('message', (message) => {
    setUnreadMsgs(() => unreadMsgs + message.newMessage);
  })

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar enableColorOnDark sx={{
          backgroundColor: theme === 'light' ? 'rgb(135, 231, 186, .4)' : 'rgb(76, 194, 137,.4)',
          backdropFilter: 'blur(14px) saturate(180%)',
          zIndex: '10',
          height: '70px'
        }} >
        <Toolbar disableGutters>
          <Grid container spacing={2} sx={{paddingX: 2}}>
          <Grid item lg={1} xs={0}/>
          <Grid item lg={3} xs={4}>
              <Box sx={{display: 'flex', flexDirection:'row', justifyContent:'start', alignItems:'center', marginX: 2}}>
                <Button onClick={() => {navigate('/dashboard')}} >
                  <img src="/img/mkdev_1200x600.gif" alt="mkdev logo" style={{height: '60px'}}/>
                </Button>
              </Box>
            </Grid>
            <Grid item lg={4} xs={2} />
            <Grid item lg={3} xs={5}>
              <Box sx={{display: 'flex', flexDirection:'row', justifyContent:'end', alignItems:'center', height: '100%'}}>
                {!!user.id ?
                  (
                    <>
                      <Tooltip title="Create Post">
                        <span>
                        <IconButton onClick={() => {navigate('/create-post')}}>
                          <AddBoxIcon fontSize="large" />
                        </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Messaging">
                        <span>
                        <IconButton onClick={() => {navigate('/messages')}} sx={{color: 'aliceblue'}}>
                          <Badge badgeContent={unreadMsgs} invisible={isHidden} color="warning">
                            <InboxIcon fontSize="large" />
                          </Badge>
                        </IconButton>
                        </span>
                      </Tooltip>
                      <Button onClick={handleOpen} sx={{ padding: 0, border: 'none', background: 'none' }}>
                        <Avatar src={user.picture}/>
                      </Button>
                      <Menu open={open} anchorEl={anchorEl} onClose={handleClose} sx={{zIndex: 11}}>
                        <MenuItem onClick={() => { navigate(`/user/${user.id}/profile`)}}>
                          Profile
                        </MenuItem>
                        <MenuItem onClick={() => { navigate(`/messages`)}}>
                          Messages
                        </MenuItem>
                        <MenuItem onClick={() => { navigate(`/create-post`)}}>
                          Create Post
                        </MenuItem>
                        <MenuItem onClick={() => { navigate(`/logout`)}}>
                          Logout
                        </MenuItem>
                        <ThemeToggle />
                      </Menu>
                    </>
                  )
                :
                  (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <Button onClick={() => {navigate('/login')}} size='large' sx={{color: useTheme().palette.secondary.main}}>Login</Button>
                      <ThemeToggle />
                    </Box>
                  )
                }
              </Box>
            </Grid>
            <Grid item lg={1} xs={0}/>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Nav;
