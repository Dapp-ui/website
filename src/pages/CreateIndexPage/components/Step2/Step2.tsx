/* eslint-disable react/jsx-key */

import React, { useMemo, useState, useEffect } from 'react'
import { useRanger } from 'react-ranger'
import cx from 'classnames'

import { Box, Typography, Button, Alert } from '@mui/material'
import { DragHandle } from '@mui/icons-material'

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
    console.log(222, index)
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

  const summaryAPR = values.reduce((acc, value, index) => {
    const { apr } = selectedVaults[index]

    const percentage = !index ? value : value - values[index - 1]

    return acc += apr * percentage / 100
  }, 0)

  return (
    <>
      <Typography component="h2" variant="h5" mb={3}>
        Setup percentage values
      </Typography>
      <Box mt={8} mb={2}>
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
      </Box>
      <Box mt={3}>
        {
          selectedVaults.map(({ protocol, tokenSymbol }, index) => {

            return (
              <div key={index} className={s.item}>
                <div className={s.square} style={{ background: colors[index] }} />
                <span>Protocol: <b>{protocol}</b>, Token: <b>{tokenSymbol}</b></span>
                {
                  selectedVaultIds.length > 2 && (
                    <Button
                      size="small"
                      variant="contained"
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
      </Box>
      <Box mt={3}>
        <Alert severity="info">Summary APR: {summaryAPR}%</Alert>
      </Box>
      <Box mt={4} className="flex justify-between">
        <Button
          size="medium"
          onClick={handleBack}
        >
          Go Back
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </>
  )
}

export default Step2
