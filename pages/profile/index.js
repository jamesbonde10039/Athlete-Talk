import {
  Box,
  Button,
  FilledInput,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import server from '../../server';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useRouter } from 'next/router';
import SimpleSnackbar from './../../components/SimpleSnackbar';

const Profile = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const handleClose = () => {
    setOpen(false);
  };

  const fetchUser = async () => {
    const response = await fetch(`/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setProfile(data.user);
    } else {
      alert('Something went wrong', response);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setUpdating(true);
    const response = await fetch(`/api/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        imageUrl: document.getElementById('imageUrl').value,
      }),
    });

    if (response.ok) {
      setMessage('Profile updated successfully');
      setSeverity('success');
      setOpen(true);
      const data = await response.json();
      setProfile(data.user);
      authContext.updateUser(data.user);
    } else {
      setMessage('Something went wrong');
      setSeverity('error');
      setOpen(true);
    }
    setLoading(false);
    setUpdating(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!profile.name) return <div>Loading...</div>;

  return (
    <>
      <Typography variant="h4">Your Profile</Typography>
      <br></br>
      <Box width="60%" ml="20%">
        <FormControl fullWidth>
          <TextField
            id="name"
            variant="outlined"
            label="Name"
            defaultValue={profile.name}
          ></TextField>
          <br></br>
          <TextField
            id="imageUrl"
            variant="outlined"
            label="Image Url"
            defaultValue={
              profile.imageUrl
                ? profile.imageUrl
                : `https://api.dicebear.com/6.x/micah/svg?seed=${profile?.name}+`
            }
          ></TextField>
          <br></br>
          <TextField
            id="email"
            variant="outlined"
            label="Email"
            defaultValue={profile.email}
          ></TextField>

          <br></br>
          <TextField
            disabled
            id="outlined-required"
            label="Role"
            defaultValue={profile.role === 'user' ? 'Athlete' : profile.role}
          />
        </FormControl>
        <br></br>
        <br></br>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => {
              router.push('/profile/category');
            }}
          >
            Update Categories
          </Button>

          <Button
            disabled={updating}
            variant="contained"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </div>
        <SimpleSnackbar
          open={open}
          handleClose={handleClose}
          message={message}
          severity={severity}
        />
      </Box>
    </>
  );
};

export default Profile;
