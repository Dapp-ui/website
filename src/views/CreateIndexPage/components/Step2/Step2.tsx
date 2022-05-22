/* eslint-disable react/jsx-key */
import React, { useMemo, useState, useEffect } from 'react'
import { useRanger } from 'react-ranger'
import { colors } from 'helpers'
import cx from 'classnames'

import { Button } from 'components/inputs'
import { Text } from 'components/dataDisplay'

import GoBackButton from '../GoBackButton/GoBackButton'
import { useContext } from '../../utils/context'

import s from './Step2.module.scss'


const getInitialDistribution = (count: number) => {
  const minValue = Math.floor(100 / count - 1)
  let currValue = 0

  return Array.from(Array(count - 1).keys()).map(() => {
    const value = currValue += minValue

    if (value > 100) {
      return 100 - currValue
    }

    return value
  })
}

type Step2Props = {
  onBack: () => void
  onContinue: () => void
}

const Step2: React.FC<Step2Props> = ({ onBack, onContinue }) => {
  const [ { vaultsMap, selectedVaultIds, percentageDistribution }, setContextState ] = useContext()

  const initialValue = percentageDistribution || getInitialDistribution(selectedVaultIds.length)

  const [ values, setValues ] = useState(initialValue)

  useEffect(() => {
    setValues(getInitialDistribution(selectedVaultIds.length))
  }, [ selectedVaultIds ])

  const { getTrackProps, ticks, segments, handles } = useRanger({
    min: 0,
    max: 100,
    stepSize: 1,
    values,
    onDrag: setValues,
  })

  const selectedVaults = useMemo(() => {
    const vaults = Object.values(vaultsMap)
    return selectedVaultIds.map((id) => vaults.find((item) => item.address === id)).sort((a, b) => a.apy - b.apy)
  }, [ selectedVaultIds ])

  const handleRemove = (index) => {
    setContextState(({ selectedVaultIds }) => ({
      selectedVaultIds: selectedVaultIds.filter((_, i) => i !== index),
    }))
  }

  const handleContinue = () => {
    setContextState({ percentageDistribution: values })
    onContinue()
  }

  let totalAPR = values.reduce((acc, value, index) => {
    const { apy } = selectedVaults[index]

    const percentage = !index ? value : value - values[index - 1]

    return acc += apy * percentage / 100
  }, 0)

  totalAPR = totalAPR ? +Number(totalAPR).toFixed(2) : totalAPR

  return (
    <>
      <div className="relative">
        <GoBackButton onClick={onBack} />
        <Text style="h3">2/3. Setup weights</Text>
      </div>
      <Text className="mb-80" style="h4" color="gray-20">Setup selected vaults weight</Text>
      <div className="pt-20">
        <div className={s.track} {...getTrackProps()}>
          <div className={s.segments}>
            {
              segments.map(({ getSegmentProps }, index) => {
                let value = values[index] - (values[index - 1] || 0)

                if (index === values.length) {
                  value = 100 - values[values.length - 1]
                }

                const { style, ...rest } = getSegmentProps()

                return (
                  <div className={s.segment} {...rest} style={style}>
                    <span className={s.segmentValue}>{value}%</span>
                    <div className={s.segmentBg} style={{ background: colors[index] }} />
                  </div>
                )
              })
            }
          </div>
          {
            handles.map(({ value, active, getHandleProps }) => (
              <button
                {...getHandleProps({
                  style: {
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none'
                  }
                })}
              >
                <div className={cx(s.handle, { [s.active]: active })} />
              </button>
            ))
          }
        </div>
      </div>
      <div className="mt-32">
        {
          selectedVaults.map(({ protocol, tokenName, apy }, index) => {

            return (
              <div key={index} className={s.item}>
                <div className={s.square} style={{ background: colors[index] }} />
                <Text className={s.title} style="p1">{tokenName}&nbsp;&nbsp;<span className="color-gray-20">{apy}%</span></Text>
                {
                  selectedVaultIds.length > 2 && (
                    <Button
                      size={28}
                      style="secondary"
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </Button>
                  )
                }
              </div>
            )
          })
        }
      </div>
      <div className="flex items-center justify-end mt-64">
        <div className={s.total}>
          <div className={s.totalAPR}>Summary APY <span>{totalAPR}%</span></div>
          <Button
            size={56}
            style="primary"
            onClick={handleContinue}
          >
            Go to Final Step
          </Button>
        </div>
      </div>
    </>
  )
}

export default Step2
