/* eslint-disable react/jsx-key */
import type { NextPage } from 'next'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'hooks'
import { useVaults } from 'contexts'
import { fetchIndexData, colors } from 'helpers'
import { Web3Provider } from '@ethersproject/providers'
import { openNotification } from '@locmod/notifications'
import { useConnectWallet } from '@web3-onboard/react'
import { useCustomRanger, getInitialValues, getSharesFromValues, getValuesFromShares } from 'hooks'
import { getIndexContract } from 'contracts'
import cx from 'classnames'

import { WidthContainer } from 'components/layout'
import { Bone } from 'components/feedback'
import { Text } from 'components/dataDisplay'
import { Button } from 'components/inputs'

import s from './EditIndexPage.module.scss'


type RangerProps = {
  initialShares: number[]
  colors: string[]
  disabled?: boolean
  viewOnly?: boolean
  onChange?: (shares: number[]) => void
}

const Ranger: React.FC<RangerProps> = ({ initialShares, colors, disabled, viewOnly, onChange }) => {
  const initialValues = getValuesFromShares(initialShares)

  const [ state, setValues ] = useCustomRanger(initialValues, {
    onChange: (values, shares) => {
      onChange(shares)
    }
  })

  const { values, getTrackProps, segments, handles } = state

  const shares = getSharesFromValues(values)

  return (
    <div className={s.trackContainer}>
      <div className={s.track} {...getTrackProps()}>
        <div className={s.segments}>
          {
            segments.map(({ getSegmentProps }, index) => {
              const { style, ...rest } = getSegmentProps()

              return (
                <div className={s.segment} {...rest} style={style}>
                  <span className={s.segmentValue}>{shares[index]}%</span>
                  <div className={s.segmentBg} style={{ background: colors[index] }} />
                </div>
              )
            })
          }
        </div>
        {
          handles.map(({ value, active, getHandleProps }) => {
            const { key, style, onMouseDown, onTouchStart, tabIndex } = getHandleProps()

            return (
              <button
                key={key}
                style={style}
                onMouseDown={!viewOnly && !disabled ? onMouseDown : () => {}}
                onTouchStart={!viewOnly && !disabled ? onTouchStart : () => {}}
                tabIndex={tabIndex}
              >
                <div className={cx(s.handle, { [s.active]: active, [s.disabled]: viewOnly })} />
              </button>
            )
          })
        }
      </div>
    </div>
  )
}

const Content: React.FC<any> = ({ indexAddress, data }) => {
  const { owner, name, symbol, components, totalAPY: currentAPY, totalPrice, totalSupply } = data

  const router = useRouter()
  const [ { wallet } ] = useConnectWallet()
  const [ activeIndexes, setActiveIndexes ] = useState([])
  const [ newRangerShares, setRangerShares ] = useState([])
  const [ newShares, setNewShares ] = useState([])
  const [ isSubmitting, setSubmitting ] = useState(false)

  const account = wallet?.accounts?.[0]?.address

  const totalWeight = components?.reduce((acc, { targetWeight }) => acc + targetWeight, 0)
  const initialShares = components.map(({ targetWeight }) => +(targetWeight * 100 / totalWeight).toFixed(0))

  const activeSharesSum = activeIndexes.reduce((acc, index) => acc += initialShares[index], 0)
  const firstRangerItemShare = Math.trunc(initialShares[activeIndexes[0]] * 100 / activeSharesSum)
  const secondRangerItemShare = 100 - firstRangerItemShare
  const initialRangerShares = [ firstRangerItemShare, secondRangerItemShare ]
  const rangerColors = [ colors[activeIndexes[0]], colors[activeIndexes[1]] ]

  let newAPY: any = newShares.reduce((acc, value, index) => {
    const { apy } = components[index]
    return acc += apy * value / 100
  }, 0)

  newAPY = newAPY ? Number(newAPY).toFixed(2) : newAPY

  if (!newAPY) {
    newAPY = currentAPY
  }

  const handleSelectItem = (index) => {
    setActiveIndexes((indexes) => {
      if (activeIndexes.includes(index)) {
        return indexes.filter((i) => i !== index)
      }

      if (activeIndexes.length === 2) {
        return indexes
      }

      return indexes.concat(index)
    })
  }

  const handleRangerChange = (shares) => {
    const [ index1, index2 ] = activeIndexes

    const newShare1 = Math.trunc(shares[0] * activeSharesSum / 100)
    const newShare2 = activeSharesSum - newShare1
    const newShares = [ ...initialShares ]

    newShares[index1] = newShare1
    newShares[index2] = newShare2

    setRangerShares(shares)
    setNewShares(newShares)
  }

  const handleSubmit = async () => {
    const [ index1, index2 ] = activeIndexes
    const [ oldShare1 ] = initialRangerShares
    const [ newShare1 ] = newRangerShares

    let values

    if (newShare1 < oldShare1) {
      const shareNum = oldShare1 - newShare1
      values = [ index1, index2, shareNum, 100, true ]
    }
    else {
      const shareNum = newShare1 - oldShare1
      values = [ index2, index1, shareNum, 100, true ]
    }

    try {
      setSubmitting(true)

      const provider = new Web3Provider(wallet.provider)
      const indexContract = getIndexContract(indexAddress, provider.getSigner() as any)

      const [ od, oi, shareNum, shareDenom, adjustWeight ] = values

      const receipt = await indexContract.rebalanceFromTo(od, oi, shareNum, shareDenom, adjustWeight)
      const txHash = await receipt.wait()

      setSubmitting(false)
      openNotification('info', {
        title: 'Success!',
        text: 'The transaction was successfully executed.',
      })
      router.push(`/indexes/${indexAddress}`)
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
      openNotification('error')
    }
  }

  return (
    <div>
      <Text style="h3" color="gray-40">Edit weights</Text>
      <Text className="mb-56" style="t1" color="gray-20">Select <b>2 vaults</b> to change their weights</Text>
      <div className={s.items}>
        {
          components.map(({ protocol, tokenName, apy }, index) => {
            const isActive = activeIndexes.includes(index)
            const isDisabled = activeIndexes.length === 2 && !isActive

            return (
              <div
                key={index}
                className={cx(s.item, { [s.active]: isActive, [s.disabled]: isDisabled || isSubmitting })}
                onClick={() => !isDisabled && !isSubmitting && handleSelectItem(index)}
              >
                <div className={s.square} style={{ color: colors[index], borderColor: colors[index] }} />
                <Text className={s.title} style="p1">{tokenName}&nbsp;&nbsp;<span className="color-gray-20">{apy}%</span></Text>
              </div>
            )
          })
        }
      </div>
      {
        activeIndexes.length === 2 ? (
          <Ranger key="edit" initialShares={initialRangerShares} colors={rangerColors} disabled={isSubmitting} onChange={handleRangerChange} />
        ) : (
          <Ranger key="viewOnly" initialShares={initialShares} colors={colors} viewOnly />
        )
      }
      <div className="flex items-center justify-end mt-64">
        <div className={s.total}>
          <div className={s.totalAPR}>APY will change <span>{currentAPY}%</span>&nbsp;→ <span>{newAPY}%</span></div>
          <Button
            size={56}
            style="primary"
            loading={isSubmitting}
            disabled={!account || currentAPY === newAPY}
            onClick={handleSubmit}
          >
            Submit Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

type EditIndexPageProps = {
  address: string
}

const EditIndexPage: NextPage<EditIndexPageProps> = ({ address }) => {
  const [ { wallet } ] = useConnectWallet()
  const { isVaultsFetching, vaultsMap } = useVaults()

  const fetcher = () => {
    return fetchIndexData(address, vaultsMap)
  }

  let { isFetching, data } = useQuery({
    endpoint: [ 'index', address ],
    fetcher,
    skip: !vaultsMap,
  })

  isFetching = isFetching || isVaultsFetching

  if (isFetching) {
    return (
      <WidthContainer>
        <Bone w={240} h={20} />
      </WidthContainer>
    )
  }

  const { owner } = data || {}
  const isOwner = wallet?.accounts?.[0].address.toLowerCase() === owner?.toLowerCase()

  return (
    <WidthContainer>
      {
        isOwner ? (
          <Content indexAddress={address} data={data} />
        ) : (
          <div className="flex justify-center">
            <Text style="h3" color="accent-red-90">You don`t have permission to edit this Index.</Text>
          </div>
        )
      }
    </WidthContainer>
  )
}

EditIndexPage.getInitialProps = ({ query }) => {

  return {
    address: query.address as string,
  }
}

export default EditIndexPage
