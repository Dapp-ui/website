import React from 'react'
import Link from 'next/link'

import { Box, Container, Typography } from '@mui/material'
import { ActiveLink } from 'components/navigation'
import { Text } from 'components/dataDisplay'

import ConnectButton from './components/ConnectButton/ConnectButton'

import s from './Header.module.scss'


const nav = [
  { title: 'Indexes', link: '/indexes' },
  { title: 'Create', link: '/create' },
  { title: 'GitHub', toTab: 'https://github.com/ETHHackathon2022' },
]

const Header: React.FC = () => {

  return (
    <Container maxWidth="lg">
      <Box pt={2} pb={2} className="flex items-center justify-between">
        <Link href="/">
          <a className={s.logo}>
            <img src="/images/logo.svg" alt="" />
            <Text style="h3">IndexClub</Text>
          </a>
        </Link>
        <div className={s.nav}>
          {
            nav.map(({ title, link, toTab }) => {
              const content = (
                <Text style="p1">{title}</Text>
              )

              if (toTab) {
                return (
                  <a key={title} href={toTab} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                )
              }

              return (
                <ActiveLink key={title} href={link} activeClassName={s.active}>
                  <a>
                    {content}
                  </a>
                </ActiveLink>
              )
            })
          }
        </div>
        <ConnectButton />
      </Box>
    </Container>
  )
}

export default Header
