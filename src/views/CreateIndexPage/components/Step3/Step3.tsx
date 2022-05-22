import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { openNotification } from '@locmod/notifications'
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
  const router = useRouter()
  const [ { wallet }, connect ] = useConnectWallet()
  const [ { connectedChain } ] = useSetChain()
  const [ { vaultsMap, selectedVaultIds, percentageDistribution } ] = useContext()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const chainId = connectedChain?.id ? parseInt(connectedChain?.id) : null
  const isWrongNetwork = chainId !== 250

  const vaults = Object.values(vaultsMap)
  let selectedVaults = selectedVaultIds.map((id) => vaults.find((item) => item.address === id)) as any

  const vaultShares = selectedVaults.map((_, index) => {
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

  const handleSubmit = async () => {
    const name = nameField.state.value
    const symbol = symbolField.state.value

    if (!name || !symbol) {
      return
    }

    try {
      setSubmitting(true)

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

      if (!components?.length) {
        openNotification('error')
        return
      }

      const receipt = await factoryContract.createIndex(name, symbol, components)
      const txHash = await receipt.wait()

      setSubmitting(false)
      openNotification('info', {
        title: 'Success!',
        text: 'Your index was successfully created!',
      })
      localStorage.removeItem('index-club-indexes-cache')
      router.push('/indexes') // TODO push to index page - added on 5/22/22 by pavelivanov
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
      openNotification('error')
    }
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
          <Text className="mb-24" style="h4">Create Index</Text>
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
                  loading={isSubmitting}
                  disabled={isWrongNetwork}
                  onClick={handleSubmit}
                >
                  Submit
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
