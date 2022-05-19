import React from 'react'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'


const MainLayout: React.PropsWithChildren<any> = ({ children }) => {

  return (
    <>
      <Header />
      <main className="mt-40">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
