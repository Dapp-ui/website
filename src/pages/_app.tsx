import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { SWRConfig } from 'swr'

import { CssBaseline } from '@mui/material'
import MainLayout from 'layouts/MainLayout/MainLayout'

import '../../styles/globals.scss'


function localStorageProvider() {
  const cacheKey = 'swr-app-cache'
  const storageValue = localStorage.getItem(cacheKey)
  // When initializing, we restore the data from `localStorage` into a map.
  const map = storageValue ? new Map(JSON.parse(storageValue)) : new Map()

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const cache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem(cacheKey, cache)
  })

  // We still use the map for write & read for performance.
  return map
}

const swrContext = {
  revalidateOnFocus: false,
  // provider: localStorageProvider,
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
