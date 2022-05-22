import React from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { Web3Provider } from '@ethersproject/providers'
import { getFactoryContract } from 'contracts'
import { colors } from 'helpers'
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
  const [ { vaultsMap, selectedVaultIds, percentageDistribution } ] = useContext()

  const vaults = Object.values(vaultsMap)

  const selectedVaults = selectedVaultIds.map((id) => vaults.find((item) => item.address === id))

  const vaultShares = selectedVaults.map(({ address }, index) => {
    const prevValue = percentageDistribution[index - 1] || 0
    const currValue = index === selectedVaultIds.length - 1 ? 100 : percentageDistribution[index]

    return currValue - prevValue
  })

  let totalAPY = percentageDistribution.reduce((acc, value, index) => {
    const { apy } = selectedVaults[index]

    const percentage = !index ? value : value - percentageDistribution[index - 1]

    return acc += apy * percentage / 100
  }, 0)

  totalAPY = totalAPY ? +Number(totalAPY).toFixed(2) : totalAPY

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
      <Text style="h3">3/3. Final Step</Text>
      <Text className="mb-80" style="h4" color="gray-20">Check everything and come up with a name and a symbol for your index</Text>
      <div className={s.content}>
        <div>
          <div className={s.vaults}>
            {
              selectedVaults.map(({ protocol, tokenName }, index) => {

                return (
                  <div key={index} className={s.vault} style={{ background: colors[index] }}>
                    <span>{tokenName}</span>
                    <span>{vaultShares[index]}%</span>
                  </div>
                )
              })
            }
          </div>
          <div className={s.totalAPY}>
            <span>Total APY</span> <b>{totalAPY}%</b>
          </div>
        </div>
        <div className={s.form}>
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
          <div className="flex justify-between mt-auto">
            <Button
              size={56}
              style="secondary"
              onClick={onBack}
            >
              Go Back
            </Button>
            {
              Boolean(wallet) ? (
                <Button
                  size={56}
                  style="primary"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Create Index
                </Button>
              ) : (
                <Button
                  size={56}
                  style="primary"
                  onClick={() => connect({})}
                >
                  Connect wallet
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Step3
