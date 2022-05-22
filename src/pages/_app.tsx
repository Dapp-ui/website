import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { VaultsProvider } from 'contexts'
import { SWRConfig } from 'swr'

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
      {
        isVisible && (
          <SWRConfig value={swrContext}>
            <VaultsProvider>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </VaultsProvider>
          </SWRConfig>
        )
      }
    </>
  )
}

export default MyApp
