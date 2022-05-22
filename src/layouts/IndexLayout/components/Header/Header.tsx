import React from 'react'
import Link from 'next/link'

import { WidthContainer } from 'components/layout'
import { ActiveLink } from 'components/navigation'
import { Button } from 'components/inputs'

import s from './Header.module.scss'


const nav = [
  { title: 'Our Team', link: '/team' },
  { title: 'GitHub', toTab: 'https://github.com/ETHHackathon2022' },
]

const Header: React.FC = () => {

  return (
    <WidthContainer>
      <div className="flex items-center justify-between py-20">
        <Link href="/">
          <a className={s.logo}>
            <img src="/images/logo.svg" alt="" />
            <div>IndexClub</div>
          </a>
        </Link>
        <div className={s.nav}>
          {
            nav.map(({ title, link, toTab }) => {
              if (toTab) {
                return (
                  <a key={title} href={toTab} target="_blank" rel="noreferrer">
                    {title}
                  </a>
                )
              }

              return (
                <ActiveLink key={title} href={link} activeClassName={s.active} exact>
                  <a>
                    {title}
                  </a>
                </ActiveLink>
              )
            })
          }
        </div>
        <Button size={44} style="primary" to="/indexes">
          Go to the App
        </Button>
      </div>
    </WidthContainer>
  )
}

export default Header
