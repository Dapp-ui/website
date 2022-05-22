import React from 'react'

import s from './NoSupport.module.scss'


const NoSupport: React.FC = () => {

  return (
    <div className={s.content}>
      <img className={s.logo} src="/images/logo.svg" alt="" />
      <div className={s.title}>Sorry! We are working to support such viewport size :(</div>
    </div>
  )
}

export default NoSupport
