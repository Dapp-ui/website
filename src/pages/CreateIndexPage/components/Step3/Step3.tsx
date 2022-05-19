import React, { useState } from 'react'

import { Box, TextField, Button } from '@mui/material'

import s from './Step3.module.scss'


type Step3Props = {
  onBack: () => void
}

const Step3: React.FC<Step3Props> = ({ onBack }) => {
  const [ name, setName ] = useState('')
  const [ nameError, setNameError ] = useState(null)
  const [ symbol, setSymbol ] = useState('')
  const [ symbolError, setSymbolError ] = useState(null)

  const handleNameChange = (event) => {
    setName(event.target.value)
    setNameError(null)
  }

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value)
    setSymbolError(null)
  }

  const checkSymbolUnique = (symbol) => {
    return Promise.resolve(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name) {
      setNameError('Required')
      return
    }

    if (!symbol) {
      setSymbolError('Required')
      return
    }

    if (!(await checkSymbolUnique(symbol))) {
      setSymbolError('Such symbol is already occupied')
      return
    }
  }

  return (
    <div className={s.content}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          error={Boolean(nameError)}
          helperText={nameError}
          fullWidth
          onChange={handleNameChange}
        />
        <Box mt={2}>
          <TextField
            label="Symbol"
            value={symbol?.toUpperCase()}
            error={Boolean(symbolError)}
            helperText={symbolError}
            fullWidth
            onChange={handleSymbolChange}
          />
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            size="medium"
            type="submit"
            fullWidth
          >
            Create Index
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            variant="text"
            size="medium"
            type="button"
            fullWidth
            onClick={onBack}
          >
            Go Back
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default Step3
