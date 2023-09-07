import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import React, { useEffect, useContext } from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import {
  CssBaseline,
  getFormLabelUtilityClasses,
  ThemeProvider,
} from '@mui/material';
import theme from './../config/theme';
import AuthContext, { AuthContextProvider } from './../store/auth-context';
import MainLayout from '../layouts/mainLayout';
import { Router, useRouter } from 'next/router';
import Head from 'next/head';
import nProgress from 'nprogress';

function MyApp({ Component, pageProps }) {
  // const getLayout = Component.getLayout || ((page) => page);
  // const component = getLayout(<Component {...pageProps} />);
  nProgress.configure({
    showSpinner: false,
    speed: 200,
    trickleRate: 0.01,
  });

  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  Router.events.on('routeChangeStart', (url) => {
    nProgress.start();
    setLoading(true);
  });
  Router.events.on('routeChangeComplete', (url) => {
    nProgress.done();
    setLoading(false);
  });

  if (Component.getLayout) {
    return (
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          <ProSidebarProvider>
            <CssBaseline />
            <Head>
              <link
                key={'nprogress'}
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
              />
              <title>AthleteTalk - The goto platform for getting peace</title>
            </Head>
            {Component.getLayout(<Component {...pageProps} />)}
          </ProSidebarProvider>
        </ThemeProvider>
      </AuthContextProvider>
    );
  }

  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <ProSidebarProvider>
          <CssBaseline />
          <Head>
            <link
              key={'nprogress'}
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
            />
            <title>
              AthleteTalk{' '}
              {router.pathname
                .split('/')
                .map(
                  (p) =>
                    p.substr(0, 1).toUpperCase() + p.substr(1).toLowerCase()
                )
                .join(' | ')}
            </title>
          </Head>
          <MainLayout>{<Component {...pageProps} />}</MainLayout>
        </ProSidebarProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
