import React, { useState } from 'react'
import { useQuery } from 'hooks'
import { useField } from 'formular'
import { Web3Provider } from '@ethersproject/providers'
import { getIndexContract } from 'contracts'
import { useConnectWallet } from '@web3-onboard/react'
import cx from 'classnames'

import { AmountInput, Button } from 'components/inputs'
import { Text } from 'components/dataDisplay'
import { Card } from 'components/layout'

import s from './Position.module.scss'


const regex = /^(|0|0\.[0-9]*|[1-9][0-9]*\.?[0-9]*)$/

const Position: React.FC = () => {
  const [ { wallet } ] = useConnectWallet()
  const [ view, setView ] = useState('buy')
  const [ amount, setAmount ] = useState('')
  const [ isSubmitting, setSubmitting ] = useState(false)

  const amountField = useField<string>()

  const fetcher = async () => {

    return {
      balance: 100,
      allowance: 100000,
    }
  }

  const { isFetching, data } = useQuery({
    endpoint: 'approve',
    fetcher,
  })

  const { balance, allowance } = data || {}
  const approveRequired = allowance < balance

  const handleChange = (event) => {
    const value = event.target.value

    if (regex.test(value)) {
      setAmount(value)
    }
  }

  const approve = () => {

  }

  const buy = async () => {
    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const indexContract = getIndexContract(provider.getSigner() as any)

      const receipt = await indexContract.deposit()
      const txHash = await receipt.wait()

      setSubmitting(false)
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const sell = async () => {
    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const indexContract = getIndexContract(provider.getSigner() as any)

      const receipt = await indexContract.withdraw()
      const txHash = await receipt.wait()

      setSubmitting(false)
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  let buttonTitle
  let buttonAction

  if (view === 'sell') {
    buttonTitle = 'Sell Index'
    buttonAction = sell
  }
  else if (approveRequired) {
    buttonTitle = 'Approve'
    buttonAction = approve
  }
  else {
    buttonTitle = 'Buy Index'
    buttonAction = buy
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-20">
        <Text style="p1">Start earn interest today</Text>
        <Text style="h4">APR 20%</Text>
      </div>
      <div className={s.tabs}>
        <Text
          className={cx(s.tab, { [s.active]: view === 'buy' })}
          style="c2"
          color="gray-90"
          onClick={() => setView('buy')}
        >
          Deposit
        </Text>
        <Text
          className={cx(s.tab, { [s.active]: view === 'sell' })}
          style="c2"
          color="gray-90"
          onClick={() => setView('sell')}
        >
          Withdraw
        </Text>
      </div>
      <div className="mt-32">
        <AmountInput
          field={amountField}
          maxValue={balance}
          label="Amount"
          placeholder="0.00"
          withChips
        />
      </div>
      <div className="mt-32">
        <Button
          size={44}
          style="primary"
          fullWidth
          onClick={buttonAction}
        >
          {buttonTitle}
        </Button>
      </div>
    </Card>
  )
}

export default Position
