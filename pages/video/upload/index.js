import { LoadingButton } from '@mui/lab';
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import FormDialog from '../../../components/FormDialog';
import MultipleSelectChip from '../../../components/MultiSelect';
import server from '../../../server';

function UploadVideo({ categories }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [newCategoryButtonClicked, setNewCategoryButtonClicked] =
    useState(false);

  // const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  let categoryIds = [];

  const extractedCategories = categories.map((category) => category.name);

  const [fileName, setFileName] = useState('');

  const [submitLoader, setSubmitLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);

    if (!title) return alert('Please provide a title for the video!');
    if (!description)
      return alert('Please provide a description for the video!');
    if (!selectedCategories.length)
      return alert('Please select at least one category for the video!');
    if (!file) return alert('Please select a file to upload!');

    categoryIds = [];
    categories.find((category) => {
      if (selectedCategories.includes(category.name)) {
        categoryIds.push(category._id);
      }
    });

    let formData = new FormData();
    formData.append('file', file.data);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categories', categoryIds);
    console.log('Sending the video upload req');
    fetch(`/api/videos/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    })
      .then((response) => {
        setSubmitLoader(false);
        if (response.ok) {
          return response.json();
        } else {
          console.log(response);
          throw new Error('Something went wrong!🥲');
        }
      })
      .then((data) => {
        // console.log(data);
        alert('Video Uploaded Successfully!');
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const handleFileChange = (e) => {
    const file = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setFileName(e.target.value);
    setFile(file);
  };
  return (
    <>
      <Typography sx={{ width: 'fit-content', margin: 'auto' }} variant="h3">
        Upload Video
      </Typography>
      <Box
        component="form"
        sx={{
          mt: 2,
          width: '80%',
          ml: '10%',
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-basic"
            label="Title"
            varient="outlined"
            value={title}
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <br></br>
        <div>
          <TextField
            id="outlined-basic"
            label="Description"
            varient="outlined"
            multiline
            maxRows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <br></br>
        <div>
          <MultipleSelectChip
            label="Categories"
            names={extractedCategories}
            personName={selectedCategories}
            setPersonName={setSelectedCategories}
          />
          <Typography variant="h6">Didn&apos;t find your category? </Typography>
          <FormDialog
            changeButtonClickState={setNewCategoryButtonClicked}
            label="Add Category"
            textPlaceHolder="Category Name"
          />
        </div>
        <br></br>
        <div>
          <Typography variant="h6" style={{ display: 'inline' }}>
            Select a video file to upload: &nbsp;
          </Typography>
          <Button variant="outlined" component="label" color="primary">
            Pick a File
            <input
              type="file"
              onChange={handleFileChange}
              hidden
              accept="video/*"
            />
          </Button>
          {fileName.split('\\').pop()}
        </div>
        <br></br>
        <div>
          {submitLoader && (
            <LoadingButton loading variant="outlined" disabled>
              Uploading
            </LoadingButton>
          )}
          {!submitLoader && (
            <LoadingButton variant="contained" onClick={handleSubmit}>
              Submit
            </LoadingButton>
          )}
        </div>
      </Box>
    </>
  );
}

export default UploadVideo;

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  if (!req.cookies.jwt) {
    console.log('Cookie not found🍪🍪');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  try {
    const categoriesResponse = await fetch(`${server}/api/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });

    let categories;
    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      if (!data.data.categories) throw new Error('No categories found');
      categories = data.data.categories;
    } else {
      // console.log(categoriesResponse);
      throw new Error('Something went wrong!🥲');
    }

    return {
      props: {
        categories,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};
