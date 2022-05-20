/* eslint-disable react/jsx-key */
import React, { useMemo, useState, useEffect } from 'react'
import { useRanger } from 'react-ranger'
import cx from 'classnames'

import { Button } from 'components/inputs'
import { Text } from 'components/dataDisplay'

import { useContext } from '../../utils/context'

import s from './Step2.module.scss'


const colors = [
  '#22ff85',
  '#0be56c',
  '#06c65c',
  '#00af53',
  '#00863c',
]

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
  const [ { vaults, selectedVaultIds, percentageDistribution }, setContextState ] = useContext()

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

  const selectedVaults = useMemo(() => (
    selectedVaultIds.map((id) => vaults.find((item) => item.address === id))
  ), [ selectedVaultIds ])

  const handleRemove = (index) => {
    setContextState(({ selectedVaultIds }) => ({
      selectedVaultIds: selectedVaultIds.filter((_, i) => i !== index),
    }))
  }

  const handleBack = () => {
    onBack()
  }

  const handleContinue = () => {
    setContextState({ percentageDistribution: values })
    onContinue()
  }

  let totalAPR = values.reduce((acc, value, index) => {
    const { apr } = selectedVaults[index]

    const percentage = !index ? value : value - values[index - 1]

    return acc += apr * percentage / 100
  }, 0)

  totalAPR = totalAPR ? +Number(totalAPR).toFixed(2) : totalAPR

  return (
    <>
      <Text className="mb-64" style="h1">
        2/3. Setup percentage values
      </Text>
      <div>
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
                  <div className={s.segment} {...rest} style={{ ...style, background: colors[index] }}>
                    <span className={s.segmentValue}>{value}%</span>
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
          selectedVaults.map(({ protocol, tokenSymbol }, index) => {

            return (
              <div key={index} className={s.item}>
                <div className={s.square} style={{ background: colors[index] }} />
                <Text className={s.title} style="p1">Protocol: <b>{protocol}</b>, Token: <b>{tokenSymbol}</b></Text>
                {
                  selectedVaultIds.length > 2 && (
                    <Button
                      size={20}
                      style="tertiary"
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
      <div className="flex justify-between mt-56">
        <Button
          size={44}
          style="tertiary"
          onClick={handleBack}
        >
          Go Back
        </Button>
        <div className="flex">
          <div className={s.totalAPR}>Total APR: {totalAPR}%</div>
          <Button
            size={44}
            style="primary"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  )
}

export default Step2
