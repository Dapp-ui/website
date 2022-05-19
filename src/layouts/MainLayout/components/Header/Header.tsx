import React from 'react'

import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'


const Header: React.FC = () => {

  return (
    <Container maxWidth="lg">
      <Toolbar disableGutters>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          sx={{ flex: 1 }}
        >
          IndexClub
        </Typography>
        <Button variant="outlined" size="small">
          Connect Wallet
        </Button>
      </Toolbar>
    </Container>
  )
}

export default Header
