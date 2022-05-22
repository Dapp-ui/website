import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { VaultsProvider } from 'contexts'
import { SWRConfig } from 'swr'

import IndexLayout from 'layouts/IndexLayout/IndexLayout'
import MainLayout from 'layouts/MainLayout/MainLayout'

import '../scss/sanitize.scss'
import '../scss/root.scss'
import '../scss/globals.scss'


const swrContext = {
  revalidateOnFocus: false,
}

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const [ isVisible, setVisible ] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  if (!isVisible) {
    return null
  }

  if ([ '/', '/team' ].includes(router.pathname)) {
    return (
      <IndexLayout>
        <Component {...pageProps} />
      </IndexLayout>
    )
  }

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
