import React, { useMemo, useState } from 'react'

import { Box, Typography, Slider, Button, Card, CardContent, Alert } from '@mui/material'

import { useContext } from '../../utils/context'

import s from './Step2.module.scss'


const sliderMarks = Array.from(Array(11).keys()).map((num) => ({ value: num * 10 }))

const getInitialDistribution = (count: number) => {
  if (count === 1) {
    return [ 100 ]
  }

  const minValue = Math.floor(100 / count)
  let leftAmount = 100

  return Array.from(Array(count).keys()).map((_, index) => {
    if (index === count - 1) {
      return leftAmount
    }

    leftAmount -= minValue

    return minValue
  })
}

type Step2Props = {
  onBack: () => void
  onContinue: () => void
}

const Step2: React.FC<Step2Props> = ({ onBack, onContinue }) => {
  const [ { vaults, selectedVaultIds, percentageDistribution }, setContextState ] = useContext()

  const initialValue = percentageDistribution || getInitialDistribution(selectedVaultIds.length)

  const [ distribution, setDistribution ] = useState(initialValue)

  const selectedVaults = useMemo(() => (
    selectedVaultIds.map((id) => vaults.find((item) => item.id === id))
  ), [])

  const handleChange = (index, value) => {
    setDistribution((values) => {
      const newValues = [ ...values ]
      newValues[index] = value
      if (selectedVaults.length === 2) {
        newValues[selectedVaults.length - 1 - index] = 100 - value
      }
      return newValues
    })
  }

  const handleEstablish = (index) => {
    setDistribution((values) => {
      const newValues = [ ...values ]
      const value = 100 - distribution.reduce((acc, value, i) => i === index ? acc : acc += value, 0)
      newValues[index] = value < 0 ? 0 : (value > 100 ? 100 : value)
      return newValues
    })
  }

  const handleBack = () => {
    onBack()
  }

  const handleContinue = () => {
    setContextState({ percentageDistribution: distribution })
    onContinue()
  }

  const valuesSum = distribution.reduce((acc, value) => acc += value, 0)

  const summaryAPR = distribution.reduce((acc, percentage, index) => {
    const { apr } = selectedVaults[index]

    return acc += apr * percentage / 100
  }, 0)

  return (
    <>
      <Typography component="h2" variant="h5" mb={3}>
        Setup percentage distribution
      </Typography>
      <div className={s.items}>
        {
          selectedVaults.map(({ id, protocol, name, apr }, index) => (
            <Card key={id} className={s.item}>
              <CardContent>
                <div>Protocol: <b>{protocol}</b></div>
                <div>Name: <b>{name}</b></div>
                <div>APR: <b>{apr}%</b></div>
                <Box mt={5}>
                  <Slider
                    step={1}
                    defaultValue={distribution[index]}
                    value={distribution[index]}
                    marks={sliderMarks}
                    valueLabelDisplay="on"
                    onChange={(event, value) => handleChange(index, value)}
                  />
                </Box>
                {
                  selectedVaults.length > 2 && (
                    <Button
                      size="medium"
                      disabled={valuesSum === 100}
                      onClick={() => handleEstablish(index)}
                    >
                      Establish
                    </Button>
                  )
                }
              </CardContent>
            </Card>
          ))
        }
      </div>
      <Box mt={3} mb={4}>
        <Alert severity="info">Summary APR: {summaryAPR}%</Alert>
        {
          valuesSum !== 100 && (
            <Box mt={2}>
              <Alert severity="error">
                Percentage distribution summ is <b>{valuesSum}%</b>. Make sure it`s <b>100%</b>.
              </Alert>
            </Box>
          )
        }
      </Box>
      <div className="flex justify-between">
        <Button
          size="medium"
          onClick={handleBack}
        >
          Go Back
        </Button>
        <Button
          size="medium"
          variant="contained"
          disabled={valuesSum !== 100}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </>
  )
}

export default Step2
