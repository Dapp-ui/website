import React from 'react'
import Link from 'next/link'

import { Box, Container, Typography } from '@mui/material'

import ConnectButton from './components/ConnectButton/ConnectButton'


const Header: React.FC = () => {

  return (
    <Container maxWidth="lg">
      <Box pt={2} pb={2} className="flex justify-between">
        <Link href="/">
          <a>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flex: 1 }}
            >
              IndexClub
            </Typography>
          </a>
        </Link>
        <ConnectButton />
      </Box>
    </Container>
  )
}

export default Header
