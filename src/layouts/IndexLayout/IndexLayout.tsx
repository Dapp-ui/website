import React from 'react'

import { Header } from './components'
import Footer from '../MainLayout/components/Footer/Footer'

import s from './IndexLayout.module.scss'


const IndexLayout: React.PropsWithChildren<any> = ({ children }) => {

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

export default IndexLayout
