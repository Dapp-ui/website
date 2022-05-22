import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { VaultsProvider } from 'contexts'
import { SWRConfig } from 'swr'

import IndexLayout from 'layouts/IndexLayout/IndexLayout'
import MainLayout from 'layouts/MainLayout/MainLayout'
import NoSupport from 'components/NoSupport/NoSupport'

import '../scss/sanitize.scss'
import '../scss/root.scss'
import '../scss/globals.scss'


const swrContext = {
  revalidateOnFocus: false,
}

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const [ isMobile, setMobile ] = useState(false)
  const [ isVisible, setVisible ] = useState(false)

  useEffect(() => {
    const docWidth = document.documentElement.clientWidth

    if (docWidth < 800) {
      setMobile(true)
    }

    setVisible(true)
  }, [])

  if (!isVisible) {
    return null
  }

  if (isMobile) {
    return <NoSupport />
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
