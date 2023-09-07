import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import AuthContext from '../store/auth-context';
import { FormLabel, Radio, RadioGroup } from '@mui/material';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const authCtx = React.useContext(AuthContext);
  const [role, setRole] = React.useState('athlete');
  const [isLoading, setIsLoading] = React.useState();
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const body = {
      email: data.get('email'),
      password: data.get('password'),
      passwordConfirm: data.get('passwordConfirm'),
      name: data.get('name'),
      role: role === 'athlete' ? 'user' : role,
    };

    // console.log(body);

    const response = await fetch(`/api/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setIsLoading(false);

    const responseData = await response.json();

    if (response.ok) {
      //set the token here...
      authCtx.login(responseData.token, responseData.data.user);
      alert('User created successfully!');
      router.push('/profile/category');
      return;
    }
    let errorMessage = 'Some error occured! Try again later.';
    try {
      errorMessage = responseData.message;
    } catch (err) {
      alert(err);
      console.log(errorMessage);
    }
    alert(errorMessage);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  id="passwordConfirm"
                  autoComplete="new-password-confirm"
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Role
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={role}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="athlete"
                    control={<Radio />}
                    label="Athlete🏃🏼‍♂️"
                  />
                  <FormControlLabel
                    value="coach"
                    control={<Radio />}
                    label="Coach👨🏼‍🏫"
                  />
                  <FormControlLabel
                    value="admin"
                    control={<Radio />}
                    label="Admin🤵🏼"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            {!isLoading && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            )}
            {isLoading && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled
              >
                Creating User...
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

SignUp.getLayout = (page) => <>{page}</>;
