import React from 'react';
import AppHeader from '../components/AppHeader';

const Home = () => {
  return <div>Home</div>;
};

Home.getLayout = (page) => (
  <>
    <AppHeader />
    {page}
  </>
);

export async function getServerSideProps(context) {
  const { req, res } = context;

  if (req.cookies.jwt) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default Home;
