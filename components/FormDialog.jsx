import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import AuthContext from '../store/auth-context';
import { useRouter } from 'next/router';

export default function FormDialog({
  label,
  textPlaceHolder,
  changeButtonClickState,
}) {
  const router = useRouter();
  const authCtx = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = (e) => {
    setLoading(true);
    if (value === '') {
      alert(`Please enter a value for ${textPlaceHolder}`);
      return;
    }

    fetch(`/api/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${authCtx.token}`,
      },
      body: JSON.stringify({
        name: value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setValue('');
          return response.json();
        } else {
          alert('Error adding category');
          throw new Error('Error adding category');
        }
      })
      .then((data) => {
        setOpen(false);
        alert('Category added successfully');
        router.replace(router.asPath);
        changeButtonClickState((prev) => !prev);
        // console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {label}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={textPlaceHolder}
            type="text"
            fullWidth
            variant="standard"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {isLoading && (
            <LoadingButton loading onClick={handleAdd}>
              Add
            </LoadingButton>
          )}
          {!isLoading && <LoadingButton onClick={handleAdd}>Add</LoadingButton>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
