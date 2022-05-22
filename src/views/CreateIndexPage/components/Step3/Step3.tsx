import React from 'react'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import { Web3Provider } from '@ethersproject/providers'
import { getFactoryContract } from 'contracts'
import { useField } from 'formular'

import { Button, Input } from 'components/inputs'
import { Text } from 'components/dataDisplay'
import { Card } from 'components/layout'

import GoBackButton from '../GoBackButton/GoBackButton'
import { useContext } from '../../utils/context'

import s from './Step3.module.scss'


type Step3Props = {
  onBack: () => void
}

const Step3: React.FC<Step3Props> = ({ onBack }) => {
  const [ { wallet }, connect ] = useConnectWallet()
  const [ { connectedChain } ] = useSetChain()
  const [ { vaultsMap, selectedVaultIds, percentageDistribution } ] = useContext()

  const chainId = connectedChain?.id ? parseInt(connectedChain?.id) : null
  const isWrongNetwork = chainId !== 250

  const vaults = Object.values(vaultsMap)
  let selectedVaults = selectedVaultIds.map((id) => vaults.find((item) => item.address === id)) as any

  const vaultShares = selectedVaults.map(({ address }, index) => {
    const prevValue = percentageDistribution[index - 1] || 0
    const currValue = index === selectedVaultIds.length - 1 ? 100 : percentageDistribution[index]

    return currValue - prevValue
  })

  selectedVaults = selectedVaults.map((vault, index) => ({
    ...vault,
    share: vaultShares[index],
  })).sort((a, b) => b.share - a.share)

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
      <div className="relative">
        <GoBackButton onClick={onBack} />
        <Text style="h3">3/3. Final Step</Text>
      </div>
      <Text className="mb-80" style="t1" color="gray-20">Check everything and come up with a name and a symbol for your index</Text>
      <div className={s.content}>
        <div>
          <table className={s.vaults}>
            <thead>
              <tr>
                <th>Vault</th>
                <th>Index Share</th>
              </tr>
            </thead>
            <tbody>
              {
                selectedVaults.map(({ protocol, tokenName, share }, index) => {

                  return (
                    <tr key={index} className={s.vault}>
                      <td>{tokenName}</td>
                      <td>{share}%</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className={s.totalAPY}>
            <span>Total APY</span> <b>{totalAPY}%</b>
          </div>
        </div>
        <Card className={s.form}>
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
          <div className="mt-24">
            {
              Boolean(wallet) ? (
                <Button
                  size={56}
                  style="primary"
                  type="submit"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Create Index
                </Button>
              ) : (
                <Button
                  size={56}
                  style="primary"
                  fullWidth
                  onClick={() => connect({})}
                >
                  Connect wallet
                </Button>
              )
            }
          </div>
        </Card>
      </div>
    </>
  )
}

export default Step3
