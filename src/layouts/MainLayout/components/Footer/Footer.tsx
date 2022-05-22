import React from 'react'

import { WidthContainer } from 'components/layout'

import s from './Footer.module.scss'


const Footer: React.FC = () => {

  return (
    <WidthContainer>
      <div className={s.footer}>
        <a className={s.logo} href="https://hackathon.money" target="_blank" rel="noreferrer">
          <img src="https://hackathon.money/images/ethglobal.svg" alt="" />
        </a>
        <div className={s.text}>
          We build the Future of Finance
        </div>
      </div>
    </WidthContainer>
  )
}

export default Footer
