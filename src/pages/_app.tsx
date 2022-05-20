import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { SWRConfig } from 'swr'

import { CssBaseline } from '@mui/material'
import MainLayout from 'layouts/MainLayout/MainLayout'

import '../scss/sanitize.scss'
import '../scss/root.scss'
import '../scss/globals.scss'


const swrContext = {
  revalidateOnFocus: false,
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [ isVisible, setVisible ] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <>
      <CssBaseline />
      {
        isVisible && (
          <SWRConfig value={swrContext}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </SWRConfig>
        )
      }
    </>
  )
}

export default MyApp
