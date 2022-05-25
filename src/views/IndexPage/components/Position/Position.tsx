import React, { useState } from 'react'
import { useQuery } from 'hooks'
import { useField, useFieldState } from 'formular'
import { constants } from 'ethers'
import { openNotification } from '@locmod/notifications'
import { Web3Provider } from '@ethersproject/providers'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { getTokenContract, getIndexContract, addresses, decimals } from 'contracts'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import { compare, formatStringNumber } from 'helpers'
import cx from 'classnames'

import { AmountInput, Button } from 'components/inputs'
import { Text } from 'components/dataDisplay'
import { Card } from 'components/layout'

import s from './Position.module.scss'


const useAllowance = (indexAddress: string, account: string) => {
  const fetcher = async () => {
    const tokenContract = getTokenContract()

    const rawAllowance = await tokenContract.allowance(account, indexAddress)

    return formatUnits(rawAllowance, decimals.token)
  }

  const { isFetching, data, mutate } = useQuery({
    endpoint: 'allowance',
    fetcher,
    skip: !account,
  })

  return {
    isAllowanceFetching: isFetching,
    allowance: data,
    mutateAllowance: mutate,
  }
}

const useBalance = (indexAddress: string, account: string) => {
  const fetcher = async () => {
    const indexContract = getIndexContract(indexAddress)
    const tokenContract = getTokenContract()

    const [
      indexSymbol,
      indexDecimals,
      rawIndexBalance,
      rawBalance,
    ] = await Promise.all([
      indexContract.symbol(),
      indexContract.decimals(),
      indexContract.balanceOf(account),
      tokenContract.balanceOf(account),
    ])

    const indexBalance = formatUnits(rawIndexBalance, indexDecimals)
    const balance = formatUnits(rawBalance, decimals.token)

    return {
      indexSymbol,
      indexDecimals,
      indexBalance,
      balance,
    }
  }

  const { isFetching, data, mutate } = useQuery({
    endpoint: 'balance',
    fetcher,
    skip: !account,
  })

  return {
    isBalanceFetching: isFetching,
    balanceData: data,
    mutateBalance: mutate,
  }
}

const openSuccessTxNotification = () => {
  openNotification('info', {
    title: 'Success!',
    text: 'The transaction was successfully executed.',
  })
}

type PositionProps = {
  indexAddress: string
  totalPrice: string
  totalSupply: string
}

const Position: React.FC<PositionProps> = ({ indexAddress, totalPrice, totalSupply }) => {
  const [ { wallet } ] = useConnectWallet()
  const [ { connectedChain } ] = useSetChain()
  const [ view, setView ] = useState('deposit')
  const [ isSubmitting, setSubmitting ] = useState(false)

  const chainId = connectedChain?.id ? parseInt(connectedChain?.id) : null
  const account = wallet?.accounts?.[0]?.address

  const { isAllowanceFetching, allowance, mutateAllowance } = useAllowance(indexAddress, account)
  const { isBalanceFetching, balanceData, mutateBalance } = useBalance(indexAddress, account)

  const amountField = useField<string>()
  const { value: amount } = useFieldState(amountField)

  const approve = async () => {
    if (!parseFloat(amount)) {
      return
    }

    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const tokenContract = getTokenContract(provider.getSigner() as any)

      // const rawAmount = parseUnits(amount, decimals.token)
      const receipt = await tokenContract.approve(indexAddress, constants.MaxUint256)
      const txHash = await receipt.wait()

      mutateAllowance(() => formatUnits(constants.MaxUint256, decimals.token))

      setSubmitting(false)
      openSuccessTxNotification()
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
      openNotification('error')
    }
  }

  const deposit = async () => {
    if (!parseFloat(amount)) {
      return
    }

    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const indexContract = getIndexContract(indexAddress, provider.getSigner() as any)
      const rawAmount = parseUnits(amount, decimals.token)

      const receipt = await indexContract.deposit(addresses.token, rawAmount)
      const txHash = await receipt.wait()

      setSubmitting(false)
      mutateBalance()
      openSuccessTxNotification()
      amountField.set('')
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
      openNotification('error')
    }
  }

  const withdraw = async () => {
    if (!parseFloat(amount)) {
      return
    }

    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const indexContract = getIndexContract(indexAddress, provider.getSigner() as any)

      const rawAmount = parseUnits(amount, indexDecimals)

      const receipt = await indexContract.withdraw(addresses.token, rawAmount)
      const txHash = await receipt.wait()

      setSubmitting(false)
      mutateBalance()
      openSuccessTxNotification()
      amountField.set('')
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const { indexSymbol, indexDecimals, indexBalance, balance } = balanceData || {}

  const isZeroAmount = !parseFloat(amount)
  const isInsufficientBalance = compare(amount, '>', balance)
  const isApproveRequired = compare(amount, '>', allowance)
  const isWrongNetwork = chainId !== 250

  const maxValue = (view === 'deposit' ? balance : indexBalance) || '0'
  const inputErrorLabel = isInsufficientBalance ? 'Insufficient balance' : null
  const userBalanceInUSD = indexBalance && totalPrice && totalSupply ? +(parseFloat(indexBalance) * parseFloat(totalPrice) / parseFloat(totalSupply)).toFixed(2) : 0

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
      <div className="mb-36 pt-8">
        <Text style="p2" color="gray-20">Your position</Text>
        <Text style="h4">
          {
            indexBalance === undefined || indexBalance === null ? (
              <>N/A</>
            ) : (
              <>{formatStringNumber(indexBalance, 15)} {indexSymbol} <span className="color-brand-90">(${userBalanceInUSD})</span></>
            )
          }
        </Text>
      </div>
      <div className={s.tabs}>
        <div
          className={cx(s.tab, { [s.active]: view === 'deposit' })}
          onClick={() => setView('deposit')}
        >
          Deposit
        </div>
        <div
          className={cx(s.tab, { [s.active]: view === 'withdraw' })}
          onClick={() => setView('withdraw')}
        >
          Withdraw
        </div>
      </div>
      <div className="mt-32">
        {
          view === 'deposit' && (
            <Text className="mb-8" style="p3" color="gray-60">
              Your balance: <b>{balance ? formatStringNumber(balance) : 0} fUSDT</b>
            </Text>
          )
        }
        <AmountInput
          field={amountField}
          maxValue={maxValue}
          label="Amount"
          errorLabel={inputErrorLabel}
          placeholder="0.00"
        />
      </div>
      <div className="mt-16">
        <Button
          size={56}
          style="primary"
          fullWidth
          loading={isSubmitting}
          disabled={!account || isWrongNetwork || isAllowanceFetching || isBalanceFetching}
          onClick={buttonAction}
        >
          {buttonTitle}
        </Button>
      </div>
    </Card>
  )
}

export default Position
