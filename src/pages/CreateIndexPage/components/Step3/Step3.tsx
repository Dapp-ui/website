import React, { useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { getFactoryContract } from 'contracts'
import { Web3Provider } from '@ethersproject/providers'

import { Box, TextField, Button } from '@mui/material'

import { useContext } from '../../utils/context'

import s from './Step3.module.scss'


type Step3Props = {
  onBack: () => void
}

const Step3: React.FC<Step3Props> = ({ onBack }) => {
  const [ { wallet }, connect ] = useConnectWallet()
  const [ { vaults, selectedVaultIds, percentageDistribution } ] = useContext()

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
    return Promise.resolve(true)
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

    const provider = new Web3Provider(wallet.provider)
    const factoryContract = getFactoryContract(provider.getSigner() as any)

    const components = (
      selectedVaultIds
        .map((id) => vaults.find((item) => item.address === id))
        .map(({ address }, index) => {
          const prevValue = percentageDistribution[index - 1] || 0
          const currValue = index === selectedVaultIds.length - 1 ? 100 : percentageDistribution[index]
          let targetWeight = currValue - prevValue

          return {
            vault: address,
            targetWeight,
          }
        })
    )

    console.log('data:', {
      name,
      symbol,
      components,
    })

    factoryContract.createIndex(name, symbol, components)
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
        {
          Boolean(wallet) ? (
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
          ) : (
            <Box mt={2}>
              <Button
                variant="contained"
                size="medium"
                type="button"
                fullWidth
                onClick={() => connect({})}
              >
                Connect wallet
              </Button>
            </Box>
          )
        }
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
