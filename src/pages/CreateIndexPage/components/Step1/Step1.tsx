import React, { useState } from 'react'
import cx from 'classnames'

import { Checkbox, ButtonBase, Alert } from '@mui/material'
import { Button } from 'components/inputs'
import { Text } from 'components/dataDisplay'

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
      <Text className="mb-56" style="h1">
        1/3. Choose from vaults
      </Text>
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
                <div>
                  Protocol: <b>{protocol}</b>, Token: <b>{tokenSymbol}</b>, APR: <b>{apr}%</b>
                </div>
              </ButtonBase>
            )
          })
        }
      </div>
      {
        isMaxError && (
          <Alert className="mt-24" severity="error">
            You can select maximum 5 items.
          </Alert>
        )
      }
      <div className="flex justify-end mt-32">
        <Button
          size={44}
          style="primary"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </>
  )
}

export default Step1
