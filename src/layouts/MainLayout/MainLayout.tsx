import React from 'react'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import s from './MainLayout.module.scss'


const MainLayout: React.PropsWithChildren<any> = ({ children }) => {

  return (
    <div className={s.layout}>
      <Header />
      <main className={s.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
