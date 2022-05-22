import React from 'react'

import { Header, Footer, Notifications } from './components'

import s from './MainLayout.module.scss'


const MainLayout: React.PropsWithChildren<any> = ({ children }) => {

  return (
    <div className={s.layout}>
      <Header />
      <main className={s.main}>
        {children}
      </main>
      <Footer />
      <Notifications />
    </div>
  )
}

export default MainLayout
