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
  const [ { vaultsMap, selectedVaultIds, shares } ] = useContext()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const chainId = connectedChain?.id ? parseInt(connectedChain?.id) : null
  const isWrongNetwork = chainId !== 250

  let selectedVaults = selectedVaultIds.map((address, index) => ({
    ...vaultsMap[address],
    share: shares[index],
  })) as any

  selectedVaults = selectedVaults.sort((a, b) => b.share - a.share)

  let totalAPY = selectedVaults.reduce((acc, vault) => {
    return acc += vault.apy * vault.share / 100
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
        selectedVaults.map(({ address, share }) => ({
          vault: address,
          targetWeight: share,
        }))
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
      <div className="flex justify-center">
        <div className={s.content}>
          <div className={s.info}>
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
            <div className="px-20">
              <div className={s.totalAPY}>
                <span>Total APY</span> <b className="color-brand-90">{totalAPY}%</b>
              </div>
            </div>
          </div>
          <div className={s.form}>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Step3
