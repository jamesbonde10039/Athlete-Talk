import { ListAlt } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

function createHex() {
  var hexCode1 = '';
  var hexValues1 = '0123456789abcdef';

  for (var i = 0; i < 6; i++) {
    hexCode1 += hexValues1.charAt(
      Math.floor(Math.random() * hexValues1.length)
    );
  }
  return hexCode1;
}

const gradients = [
  'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
  'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
  'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)',
  'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
  'linear-gradient(45deg, #FFC3A0 0%, #FFAFBD 100%)',
  'linear-gradient(45deg, #B6CEE8 0%, #F578DC 100%)',
  'linear-gradient(45deg, #F3FFB6 0%, #CA74F7 100%)',
];

const MyPlans = ({ userPlans }) => {
  // console.log(userPlans);
  const router = useRouter();
  return (
    <>
      <Typography
        sx={{ width: 'fit-content', margin: 'auto', mt: 1, mb: 2 }}
        variant="h4"
      >
        My Plans
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {userPlans.map((plan, idx) => (
          <Box key={idx}>
            <Card
              sx={{
                width: '300px',
                height: '300px',
                m: 1,
                borderRadius: '10px',
              }}
            >
              <Box
                sx={{
                  height: 140,
                  background: `${gradients[idx % gradients.length]}`,
                }}
              />
              <Box
                sx={{
                  background: 'white',
                  width: 'fit-content',
                  borderRadius: '50px',
                  padding: '5px 10px',
                  boxShadow: `0px 2px 4px #2ecc71`,
                  position: 'relative',
                  mt: '-20px',
                  ml: '5px',
                }}
              >
                <Typography variant="h6" sx={{ verticalAlign: 'middle' }}>
                  Progress :{' '}
                  {(plan.progress / plan.plan.noOfDays).toPrecision(2) * 100}%
                </Typography>
              </Box>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    mt: '10px',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {plan.plan.name}
                </Typography>
              </CardContent>
              <CardActions>
                {plan.progress === plan.plan.noOfDays && (
                  <Button disabled variant="contained">
                    Completed✅
                  </Button>
                )}
                {plan.progress !== plan.plan.noOfDays && (
                  // <Link href={`/plans/myplan/continue/${plan.plan.id}`}>
                  //   Continue
                  // </Link>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/plans/myplan/continue/${plan.plan.id}`);
                    }}
                    variant="contained"
                  >
                    Continue
                  </Button>
                )}
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const { id } = context.query;
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
    const userPlansResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user-plans`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (userPlansResponse.ok) {
      const userPlans = await userPlansResponse.json();

      return {
        props: {
          userPlans: userPlans.data.plans,
        },
      };
    } else {
      throw new Error('Something went wrong: ', userPlansResponse);
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
    props: {},
  };
}

export default MyPlans;
