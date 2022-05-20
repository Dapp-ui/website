import React, { useState } from 'react'
import cx from 'classnames'

import { Box, Typography, Checkbox, Button, ButtonBase, Alert } from '@mui/material'

import { useContext } from '../../utils/context'

import s from './Step1.module.scss'


type Step1Props = {
  onContinue: () => void
}

const Step1: React.FC<Step1Props> = ({ onContinue }) => {
  const [ { vaults, selectedVaultIds }, setContextState ] = useContext()
  const [ selectedIds, setSelectedIds ] = useState<string[]>(selectedVaultIds || [])
  const [ isMaxError, setMaxError ] = useState(false)

  const handleItemClick = (address: string) => {
    let newIds

    if (selectedIds.includes(address)) {
      newIds = selectedIds.filter((id) => id !== address)
    }
    else {
      newIds = [ ...selectedIds, address ]
    }

    if (newIds.length > 5) {
      setMaxError(true)
      return
    }

    setMaxError(false)
    setSelectedIds(newIds)
  }

  const handleContinue = () => {
    setContextState({ selectedVaultIds: selectedIds })
    onContinue()
  }

  return (
    <>
      <Typography component="h2" variant="h5" mb={3}>
        Choose from vaults
      </Typography>
      <div className={s.items}>
        {
          vaults.map(({ address, protocol, tokenSymbol, apr }) => {
            const isSelected = selectedIds.includes(address)

            const className = cx(s.item, {
              [s.selected]: isSelected,
            })

            return (
              <ButtonBase key={address} className={className} onClick={() => handleItemClick(address)}>
                <Checkbox className={s.checkbox} checked={isSelected} />
                <div>Protocol: <b>{protocol}</b></div>
                <div>Token: <b>{tokenSymbol}</b></div>
                <div>APR: <b>{apr}%</b></div>
              </ButtonBase>
            )
          })
        }
      </div>
      {
        isMaxError && (
          <Box mt={4}>
            <Alert severity="error">
              You can select maximum 5 items.
            </Alert>
          </Box>
        )
      }
      <Box mt={4} className="flex justify-end">
        <Button
          size="medium"
          variant="contained"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </>
  )
}

export default Step1
