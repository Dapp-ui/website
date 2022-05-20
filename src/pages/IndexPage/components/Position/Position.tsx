import React, { useState } from 'react'
import { useQuery } from 'hooks'
import { Web3Provider } from '@ethersproject/providers'
import { getIndexContract } from 'contracts'
import { useConnectWallet } from '@web3-onboard/react'
import { Container, Button, Card, CardContent, TextField } from '@mui/material'
import cx from 'classnames'

import s from './Position.module.scss'


const regex = /^(|0|0\.[0-9]*|[1-9][0-9]*\.?[0-9]*)$/

const Position: React.FC = () => {
  const [ { wallet } ] = useConnectWallet()
  const [ view, setView ] = useState('buy')
  const [ amount, setAmount ] = useState('')
  const [ isSubmitting, setSubmitting ] = useState(false)

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
      <CardContent>
        <div className={s.tabs}>
          <div
            className={cx(s.tab, { [s.active]: view === 'buy' })}
            onClick={() => setView('buy')}
          >
            Buy
          </div>
          <div
            className={cx(s.tab, { [s.active]: view === 'sell' })}
            onClick={() => setView('sell')}
          >
            Sell
          </div>
        </div>
        <div className="mt-20">
          <TextField
            label="Amount"
            value={amount}
            fullWidth
            onChange={handleChange}
          />
        </div>
        <div className="mt-20">
          <Button
            variant="contained"
            size="medium"
            type="button"
            fullWidth
            onClick={buttonAction}
          >
            {buttonTitle}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Position
