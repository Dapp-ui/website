import type { AppProps } from 'next/app'

import CssBaseline from '@mui/material/CssBaseline'
import MainLayout from 'layouts/MainLayout/MainLayout'

import '../../styles/globals.scss'


const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <CssBaseline />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  )
}

export default MyApp
