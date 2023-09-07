import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
const { server } = require('./../../../utils/server');

const colors = [
  '#f8bbd0',
  '#e1bee7',
  '#d1c4e9',
  '#c5cae9',
  '#bbdefb',
  '#b3e5fc',
  '#b2ebf2',
  '#b2dfdb',
  '#c8e6c9',
  '#dcedc8',
  '#f0f4c3',
  '#fff9c4',
  '#ffecb3',
  '#ffe0b2',
  '#ffccbc',
  '#d7ccc8',
  '#f5f5f5',
  '#cfd8dc',
];

const BrowsePlans = ({ plans, preferredCategories }) => {
  console.log(plans);
  const plansSortedByPreferredCategories = plans.sort((a, b) => {
    const aCategory = a.categories;
    const bCategory = b.categories;
    let presentA = false;
    let presentB = false;
    for (let i = 0; i < preferredCategories.length; i++) {
      if (aCategory.some((category) => category === preferredCategories[i])) {
        presentA = true;
      }
      if (bCategory.some((category) => category === preferredCategories[i])) {
        presentB = true;
      }
    }
    if (!presentA && !presentB) {
      return 0;
    }
    if (!presentA) {
      return 1;
    }
    if (!presentB) {
      return -1;
    }
    return 0;
  });

  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {plansSortedByPreferredCategories.map((plan, idx) => {
          return (
            // <Grid xs={4} key={idx} item>
            <Card
              key={idx}
              sx={{
                backgroundColor: colors[idx % colors.length],
                borderRadius: '10px',
                height: '100%',

                m: 1,
                width: 275,
                height: 275,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <Box p={2}>
                  <Typography
                    color="text.primary"
                    variant="h5"
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {plan.name.slice(0, 30) +
                      (plan.name.length > 30 ? '...' : '')}
                  </Typography>
                  <Typography
                    color="text.primary"
                    variant="p"
                    sx={{ display: 'block', mt: '30px' }}
                  >
                    {plan.description.slice(0, 45) +
                      (plan.description.length > 45 ? '...' : '')}
                  </Typography>
                  <Typography color="text.primary" variant="body1">
                    <b>Created By</b>: {plan.creator.name}
                  </Typography>
                </Box>
                <Button
                  sx={{
                    backgroundColor: '#192a56',
                    color: 'white',
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '0px',
                  }}
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/plans/browse/${plan._id}`);
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
            // </Grid>
          );
        })}
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
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
    const plans = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });

    if (plans.ok) {
      const data = await plans.json();

      return {
        props: {
          plans: data.data.plans,
          preferredCategories: data.data.preferredCategories,
        },
      };
    } else {
      console.log(plans);
      throw new Error('Something went wrong', plans);
    }
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
    props: {}, // will be passed to the page component as props
  };
}

export default BrowsePlans;
