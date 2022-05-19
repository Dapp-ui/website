import React, { useState } from 'react'
import cx from 'classnames'

import { Box, Typography, Checkbox, Button, ButtonBase, Card, CardContent } from '@mui/material'

import { useContext } from '../../utils/context'

import s from './Step1.module.scss'


type Step1Props = {
  onContinue: () => void
}

const Step1: React.FC<Step1Props> = ({ onContinue }) => {
  const [ { vaults, selectedVaultIds }, setContextState ] = useContext()
  const [ selectedIds, setSelectedIds ] = useState<number[]>(selectedVaultIds || [])

  const handleItemClick = (id) => {
    let newIds

    if (selectedIds.includes(id)) {
      newIds = selectedIds.filter((_id) => _id !== id)
    }
    else {
      newIds = [ ...selectedIds, id ]
    }

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
          vaults.map(({ id, protocol, name, apr }) => {
            const isSelected = selectedIds.includes(id)

            const className = cx(s.item, {
              [s.selected]: isSelected,
            })

            return (
              <Card key={name} className={className}>
                <ButtonBase onClick={() => handleItemClick(id)}>
                  <CardContent>
                    <Checkbox className={s.checkbox} checked={isSelected} />
                    <div>Protocol: <b>{protocol}</b></div>
                    <div>Name: <b>{name}</b></div>
                    <div>APR: <b>{apr}%</b></div>
                  </CardContent>
                </ButtonBase>
              </Card>
            )
          })
        }
      </div>
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
