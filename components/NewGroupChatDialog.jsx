import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  FormControl,
  Input,
  InputLabel,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  Avatar,
  Stack,
  Icon,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { server } from '../utils/server';
import Image from 'next/image';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useRef } from 'react';
import SimpleSnackbar from '../components/SimpleSnackbar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PersonAdd } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewGroupChatDialog({ setAllChats }) {
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [queriedUsers, setQueriedUsers] = React.useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatName = useRef();

  const handleClickOpen = () => {
    setQueriedUsers([]);
    setSelectedUsers([]);
    setLoading(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // create group chat
    if (selectedUsers.length < 2) {
      // alert('Please select at least two user');
      setSnackbarMessage('Please select at least two user');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    const selectedUsersId = selectedUsers.map((user) => user.id);

    const body = {
      name: chatName.current.value,
      users: selectedUsersId,
    };

    const createGroupReq = await fetch(`/api/chat/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(body),
    });

    if (createGroupReq.ok) {
      const newChat = await createGroupReq.json();

      setAllChats((prevChats) => {
        return [newChat.data.chat, ...prevChats];
      });
      setSnackbarMessage('Group chat created');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } else {
      console.log(createGroupReq);
      setSnackbarMessage('Something went wrong');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }

    handleClose();
  };

  const handleSearch = async (query) => {
    // search for users
    setSearch(query);
    if (query.length === 0) {
      setTimeout(() => {
        setQueriedUsers([]);
      }, 1000);
      return;
    }

    setLoading(true);

    try {
      const queriedUsers = await fetch(`/api/users/find?search=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      const queriedUsersData = await queriedUsers.json();

      setQueriedUsers(queriedUsersData.users);
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage('Fetching users failed');
      setSnackbarSeverity('error');

      // alert(error);
    }

    setLoading(false);
  };

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  const onClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <div>
      <Button
        variant="standard"
        sx={{
          display: 'inline-block',
          textTransform: 'none',
          bgcolor: '#74b9ff',
        }}
        onClick={handleClickOpen}
      >
        New Group Chat
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
        keepMounted
        fullWidth
      >
        <Typography p={3} paddingTop={2} paddingBottom={0} variant="h5">
          Create Group Chat
        </Typography>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              id="outlined-basic"
              label="Chat Name"
              variant="outlined"
              inputRef={chatName}
            ></TextField>
            <br></br>
            <TextField
              id="outlined-basic"
              label="Add Users"
              variant="outlined"
              onChange={(e) => handleSearch(e.target.value)}
            ></TextField>
            {/* Show selected Users */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {selectedUsers.map((user) => {
                return (
                  <Box
                    key={user.name}
                    sx={{
                      display: 'flex',
                      backgroundColor: '#e5d1ff',
                      padding: '5px',
                      margin: '5px',
                      borderRadius: '5px',
                      marginTop: '5px',
                      width: 'fit-content',
                    }}
                  >
                    <Avatar
                      sx={{ width: '25px', height: '25px' }}
                      src={`https://api.dicebear.com/6.x/micah/svg?seed=${user.name}+`}
                    />
                    <Typography variant="body1">{user.name}</Typography>
                    <CloseIcon
                      onClick={(e) => {
                        setSelectedUsers(
                          selectedUsers.filter((u) => u.name !== user.name)
                        );
                      }}
                    />
                  </Box>
                );
              })}
            </Box>

            {/* render list of users */}
            {loading && <p>Loading...</p>}
            {!loading &&
              queriedUsers &&
              queriedUsers.slice(0, 4).map((user) => {
                return (
                  <Box
                    key={user._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f0f0f0',
                      padding: '5px',
                      borderRadius: '5px',
                      marginTop: '5px',
                    }}
                  >
                    <Avatar
                      sx={{ width: '30px', height: '30px' }}
                      src={`https://api.dicebear.com/6.x/micah/svg?seed=${user?.name}+`}
                    />
                    <Typography variant="body1">{user.name}</Typography>
                    {!selectedUsers.some((u) => u.name === user.name) && (
                      <Button
                        sx={{ width: '90px' }}
                        variant="outlined"
                        onClick={(e) => {
                          setSelectedUsers([
                            ...selectedUsers,
                            { name: user.name, id: user._id },
                          ]);
                        }}
                      >
                        Add
                      </Button>
                    )}
                    {selectedUsers.some((u) => u.name === user.name) && (
                      <Button
                        sx={{ width: '90px' }}
                        variant="contained"
                        onClick={(e) => {
                          setSelectedUsers(
                            selectedUsers.filter((u) => user.name !== u.name)
                          );
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                );
              })}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <SimpleSnackbar
        open={openSnackbar}
        handleClose={onClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
}
