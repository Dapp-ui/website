import React, { useMemo } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { getFactoryContract } from 'contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useField } from 'formular'

import { Button, Input } from 'components/inputs'
import { Text } from 'components/dataDisplay'

import { useContext } from '../../utils/context'

import s from './Step3.module.scss'


type Step3Props = {
  onBack: () => void
}

const Step3: React.FC<Step3Props> = ({ onBack }) => {
  const [ { wallet }, connect ] = useConnectWallet()
  const [ { vaults, selectedVaultIds, percentageDistribution } ] = useContext()

  const selectedVaults = useMemo(() => (
    selectedVaultIds.map((id) => vaults.find((item) => item.address === id))
  ), [])

  let totalAPR = percentageDistribution.reduce((acc, value, index) => {
    const { apr } = selectedVaults[index]

    const percentage = !index ? value : value - percentageDistribution[index - 1]

    return acc += apr * percentage / 100
  }, 0)

  totalAPR = totalAPR ? +Number(totalAPR).toFixed(2) : totalAPR

  const nameField = useField<string>()
  const symbolField = useField<string>()

  const checkSymbolUnique = (symbol) => {
    return Promise.resolve(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = nameField.state.value
    const symbol = symbolField.state.value

    if (!name || !symbol) {
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
    <>
      <Text className="mb-64" style="h1">
        2/3 Setup percentage values
      </Text>
      <div className={s.content}>
        <div className={s.info}>
          <div>
            {
              selectedVaults.map(({ protocol, tokenSymbol }, index) => {

                return (
                  <div key={index} className={s.item}>
                    <Text className={s.title} style="p1">Protocol: <b>{protocol}</b>, Token: <b>{tokenSymbol}</b></Text>
                  </div>
                )
              })
            }
          </div>
          <Text className="mt-16" style="p1">
            Total APR: <b>{totalAPR}%</b>
          </Text>
        </div>
        <form  className="mt-32" onSubmit={handleSubmit}>
          <Input
            size={56}
            placeholder="Name"
            field={nameField}
          />
          <Input
            size={56}
            className="mt-20"
            placeholder="Symbol"
            field={symbolField}
          />
          {
            Boolean(wallet) ? (
              <Button
                className="mt-32"
                size={44}
                style="primary"
                type="submit"
                fullWidth
              >
                Create Index
              </Button>
            ) : (
              <Button
                className="mt-32"
                size={44}
                style="primary"
                fullWidth
                onClick={() => connect({})}
              >
                Connect wallet
              </Button>
            )
          }
          <Button
            className="mt-8"
            size={44}
            style="tertiary"
            fullWidth
            onClick={onBack}
          >
            Go Back
          </Button>
        </form>
      </div>
    </>
  )
}

export default Step3
