import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import FormDialog from '../../../components/FormDialog';
import MultipleSelectChip from '../../../components/MultiSelect';
import server from '../../../server';
import MultiSelectTable from '../../../components/MultiSelectTable';

const CreatePlans = ({ categories, videos }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const extractedCategories = categories.map((category) => category.name);
  const [newCategoryButtonClicked, setNewCategoryButtonClicked] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [noOfDays, setNoOfDays] = useState(1);
  const [planName, setPlanName] = useState('');
  const [planDes, setPlanDes] = useState('');
  const [videosSelected, setVideosSelected] = useState([[]]);
  const [loading, setLoading] = useState(false);
  // console.log(videosSelected);
  const handleCreatePlans = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (
      !planName ||
      !planDes ||
      selectedCategories.length == 0 ||
      noOfDays == 0
    ) {
      alert('Please fill all the fields');
      return;
    }

    const filteredCateogries = categories.filter((category) =>
      selectedCategories.includes(category.name)
    );
    const selectedCategoriesID = filteredCateogries.map(
      (category) => category._id
    );
    // console.log(filteredCateogries);

    const plan = {
      name: planName,
      description: planDes,
      categories: selectedCategoriesID,
      noOfDays: noOfDays,
      videos: videosSelected,
    };

    console.log(`/api/plans`);
    const postResponse = await fetch(`/api/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plan),
    });

    if (postResponse.ok) {
      alert('Plan created successfully');
    } else {
      alert('Error creating plan');
      console.log(postResponse);
    }
    setLoading(false);
  };

  useEffect(() => {
    setVideosSelected((prev) => {
      const newVideosSelected = prev;
      let diff = noOfDays - prev.length;
      while (diff !== 0) {
        if (diff > 0) {
          newVideosSelected.push([]);
          diff--;
        } else {
          newVideosSelected.pop();
          diff++;
        }
      }
      return newVideosSelected;
    });
  }, [noOfDays]);

  const handleNext = () => {
    if (currentPage == 0 || (currentPage == 1 && currentDay == noOfDays)) {
      setCurrentPage((prev) => prev + 1);
    } else if (currentPage == 1) {
      setCurrentDay((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage == 2 || (currentPage == 1 && currentDay == 1)) {
      setCurrentPage((prev) => prev - 1);
    } else if (currentPage == 1) {
      setCurrentDay((prev) => prev - 1);
    }
  };

  const page0 = (
    <>
      <TextField
        margin="normal"
        required
        id="name"
        label="Plan Name"
        name="name"
        autoComplete="name"
        autoFocus
        fullWidth
        onChange={(e) => setPlanName(e.target.value)}
        value={planName}
      />

      <TextField
        margin="normal"
        required
        id="description"
        label="Plan Description"
        name="description"
        autoComplete="description"
        fullWidth
        onChange={(e) => setPlanDes(e.target.value)}
        value={planDes}
      />

      <TextField
        margin="normal"
        required
        type="number"
        id="noOfDays"
        label="No of Days"
        name="noOfDays"
        autoComplete="No of Days"
        fullWidth
        inputProps={{ min: '0', max: '60' }}
        onChange={(e) => {
          setNoOfDays(e.target.value);
        }}
        value={noOfDays}
      />
      <br></br>
      <br></br>
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
    </>
  );

  const page1 = (
    <>
      <Typography variant="h4">Day {currentDay}</Typography>
      <MultiSelectTable
        rows={videos}
        selectedVideos={videosSelected}
        setVideosSelected={setVideosSelected}
        day={currentDay - 1}
      />
    </>
  );
  const page2 = (
    <>
      <Typography variant="h4">Summary</Typography>
      <TableContainer component={Paper} sx={{ height: '400px', mt: '20px' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Plan Name</TableCell>
              <TableCell>{planName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>{planDes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>No Of Days</TableCell>
              <TableCell>{noOfDays}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Categories</TableCell>
              <TableCell>{selectedCategories.join(', ')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Day</b>
              </TableCell>
              <TableCell>
                <b>Video Name</b>
              </TableCell>
            </TableRow>
            {videosSelected.map((vid, index) => {
              return vid.map((id) => {
                const video = videos.find((video) => video.id == id);
                return (
                  <TableRow key={id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{video.title}</TableCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const pages = [page0, page1, page2];

  return (
    <>
      <Typography sx={{ width: 'fit-content', margin: 'auto' }} variant="h3">
        Create Plans
      </Typography>
      <Box
        alignContent={'center'}
        component="form"
        noValidate
        onSubmit={handleCreatePlans}
        sx={{ mt: 1, width: '80%', ml: '10%' }}
      >
        {pages[currentPage]}
        <br></br>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="standard" onClick={handleBack}>
            Back
          </Button>
          {currentPage != pages.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
          {currentPage == pages.length - 1 && (
            <Button
              disabled={loading}
              variant="contained"
              onClick={handleCreatePlans}
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CreatePlans;

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

    const videosResponse = await fetch(`${server}/api/videos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });

    let videos;
    if (videosResponse.ok) {
      const data = await videosResponse.json();
      if (!data.data.videos) throw new Error('No videos found');
      videos = data.data.videos;
    } else {
      // console.log(videosResponse);
      throw new Error('Something went wrong!🥲');
    }

    return {
      props: {
        categories,
        videos,
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
