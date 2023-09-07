import {
  Button,
  Card,
  CardContent,
  Grid,
  Icon,
  Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import SimpleSnackbar from './../../components/SimpleSnackbar';
import { useRouter } from 'next/router';
import { ArrowBack, Backpack } from '@mui/icons-material';

const colors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#00bcd4',
  '#009688',
  '#4caf50',
];

const category = ({ categories, userCategories }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const handleClose = () => {
    setOpen(false);
  };

  const [preferredCategories, setPreferredCategories] =
    useState(userCategories);

  const handleCategoryClick = (id) => {
    if (preferredCategories.some((category) => category._id === id)) {
      const updatedCategories = preferredCategories.filter(
        (category) => category._id !== id
      );
      setPreferredCategories(updatedCategories);
    } else {
      const idx = categories.findIndex((category) => category._id === id);
      setPreferredCategories([...preferredCategories, categories[idx]]);
    }

    // console.log(preferredCategories);
  };

  const handleUpdateCategory = async () => {
    setLoading(true);
    const updatedCategoriesResponse = await fetch(`/api/users/category`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        preferredCategories: preferredCategories.map(
          (category) => category._id
        ),
      }),
    });

    if (updatedCategoriesResponse.ok) {
      setMessage('Categories updated successfully');
      setSeverity('success');
      setOpen(true);
    } else {
      setMessage('Something went wrong');
      setSeverity('error');
      setOpen(true);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button variant={'outlined'} onClick={() => router.push('/profile')}>
        <Icon component={ArrowBack} />
      </Button>
      <br></br>
      <br></br>
      <Grid container spacing={2}>
        {categories.map((category, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
            <Card
              sx={{
                minWidth: '250px',
                height: '150px',
                backgroundColor: preferredCategories.some(
                  (ctg) => ctg._id === category._id
                )
                  ? '#000'
                  : colors[idx % colors.length],
                cursor: 'pointer',
              }}
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'white' }}
                >
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <br></br>
      <br></br>
      <Button
        disabled={loading}
        variant={'contained'}
        onClick={handleUpdateCategory}
      >
        Update
      </Button>
      <SimpleSnackbar
        open={open}
        handleClose={handleClose}
        message={message}
        severity={severity}
      />
    </div>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const { jwt } = req.cookies;

  if (!jwt) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  try {
    const categoriesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const userCategoriesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/category`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!categoriesResponse.ok || !userCategoriesResponse.ok) {
      throw new Error('Something went wrong!', categoriesResponse);
    }

    const categories = await categoriesResponse.json();
    const userCategories = await userCategoriesResponse.json();

    return {
      props: {
        categories: categories.data.categories,
        userCategories: userCategories.data.userCategories,
      }, // will be passed to the page component as props
    };
  } catch (error) {
    return {
      props: {}, // will be passed to the page component as props
    };
  }
}

export default category;
