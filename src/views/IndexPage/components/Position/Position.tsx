import React, { useState } from 'react'
import { useQuery } from 'hooks'
import { useField, useFieldState } from 'formular'
import { constants } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { getTokenContract, getIndexContract, addresses, decimals } from 'contracts'
import { useConnectWallet } from '@web3-onboard/react'
import { compare, formatStringNumber } from 'helpers'
import cx from 'classnames'

import { AmountInput, Button } from 'components/inputs'
import { Text } from 'components/dataDisplay'
import { Card } from 'components/layout'

import s from './Position.module.scss'


type PositionProps = {
  indexAddress: string
}

const Position: React.FC<PositionProps> = ({ indexAddress }) => {
  const [ { wallet } ] = useConnectWallet()
  const [ view, setView ] = useState('deposit')
  const [ isSubmitting, setSubmitting ] = useState(false)

  const account = wallet?.accounts?.[0]?.address
  const amountField = useField<string>()
  const { value: amount } = useFieldState(amountField)

  const approve = async () => {
    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const tokenContract = getTokenContract(provider.getSigner() as any)

      // const rawAmount = parseUnits(amount, decimals.token)
      const receipt = await tokenContract.approve(indexAddress, constants.MaxUint256)
      const txHash = await receipt.wait()

      setSubmitting(false)
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const deposit = async () => {
    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const indexContract = getIndexContract(indexAddress, provider.getSigner() as any)
      const rawAmount = parseUnits(amount, decimals.token)

      const receipt = await indexContract.deposit(addresses.token, rawAmount)
      const txHash = await receipt.wait()

      setSubmitting(false)
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const withdraw = async () => {
    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const indexContract = getIndexContract(indexAddress, provider.getSigner() as any)

      const rawAmount = parseUnits(amount, indexDecimals)

      const receipt = await indexContract.withdraw(addresses.token, rawAmount)
      const txHash = await receipt.wait()

      setSubmitting(false)
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const fetcher = async () => {
    const indexContract = getIndexContract(indexAddress)
    const tokenContract = getTokenContract()

    const [
      indexSymbol,
      indexDecimals,
      rawIndexBalance,
      rawBalance,
      rawAllowance,
    ] = await Promise.all([
      indexContract.symbol(),
      indexContract.decimals(),
      indexContract.balanceOf(account),
      tokenContract.balanceOf(account),
      tokenContract.allowance(account, indexAddress),
    ])

    const indexBalance = formatUnits(rawIndexBalance, indexDecimals)
    const balance = formatUnits(rawBalance, decimals.token)
    const allowance = formatUnits(rawAllowance, decimals.token)

    return {
      indexSymbol,
      indexDecimals,
      indexBalance,
      balance,
      allowance,
    }
  }

  const { isFetching, data } = useQuery({
    endpoint: 'approve',
    fetcher,
    skip: !account,
  })

  const { indexSymbol, indexDecimals, indexBalance, balance, allowance } = data || {}

  const isZeroAmount = !parseFloat(amount)
  const isInsufficientBalance = compare(amount, '>', balance)
  const isApproveRequired = compare(amount, '>', allowance)

  const maxValue = (view === 'deposit' ? balance : indexBalance) || '0'
  const inputErrorLabel = isInsufficientBalance ? 'Insufficient balance' : null

  let buttonTitle
  let buttonAction

  if (view === 'withdraw') {
    buttonTitle = 'Sell Index'
    buttonAction = withdraw
  }
  else if (isApproveRequired) {
    buttonTitle = 'Approve'
    buttonAction = approve
  }
  else {
    buttonTitle = 'Buy Index'
    buttonAction = deposit
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-20">
        {
          Boolean(indexBalance) ? (
            view === 'deposit' ? (
              <div>
                <Text style="p2" color="gray-60">Your balance</Text>
                <Text style="h4">{formatStringNumber(balance)} fUSDT</Text>
              </div>
            ) : (
              <div>
                <Text style="p2" color="gray-60">Your position</Text>
                <Text style="h4">{formatStringNumber(indexBalance, 15)} {indexSymbol}</Text>
              </div>
            )
          ) : (
            <Text style="p1">Start earning on<br />indexes today</Text>
          )
        }
        <div className="text-right">
          <Text style="p2" color="gray-60">APR</Text>
          <Text style="h4">20%</Text>
        </div>
      </div>
      <div className={s.tabs}>
        <Text
          className={cx(s.tab, { [s.active]: view === 'deposit' })}
          style="c2"
          color="gray-90"
          tag="button"
          onClick={() => setView('deposit')}
        >
          Deposit
        </Text>
        <Text
          className={cx(s.tab, { [s.active]: view === 'withdraw' })}
          style="c2"
          color="gray-90"
          tag="button"
          onClick={() => setView('withdraw')}
        >
          Withdraw
        </Text>
      </div>
      <div className="mt-32">
        <AmountInput
          field={amountField}
          maxValue={maxValue}
          label="Amount"
          errorLabel={inputErrorLabel}
          placeholder="0.00"
        />
      </div>
      <div className="mt-32">
        <Button
          size={44}
          style="primary"
          fullWidth
          loading={isSubmitting}
          disabled={!account || isZeroAmount || isFetching}
          onClick={buttonAction}
        >
          {buttonTitle}
        </Button>
      </div>
    </Card>
  )
}

export default Position
