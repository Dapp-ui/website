import React from 'react'

import s from './Card.module.scss'


const Card: React.FC<React.PropsWithChildren<any>> = ({ children }) => {

  return (
    <div className={s.card}>
      {children}
    </div>
  )
}

export default Card
