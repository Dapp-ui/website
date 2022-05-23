import { useState } from 'react'
import { useRanger } from 'react-ranger'
import type { Ranger } from 'react-ranger'


// [ 20, 30, 50 ] => [ 20, 50 ]
export const getValuesFromShares = (initialShares: number[]) => {
  let prevValue = 0
  return initialShares.slice(0, -1).map((share) => prevValue += share)
}

export const getInitialValues = (count: number) => {
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

// [ 20, 50 ] => [ 20, 30, 50 ]
export const getSharesFromValues = (values: number[]) => {
  return values.concat(100).map((value, index) => {
    const prevValue = values[index - 1] || 0
    return value - prevValue
  })
}

type Result = [
  Ranger & { values: number[] },
  (state: number[]) => void
]

type Opts = {
  onChange?: (values: number[], shares: number[]) => void
}

export const useCustomRanger = (initialValues: number[], { onChange }: Opts = {}): Result => {
  const [ values, setValues ] = useState(initialValues)

  const handleDrag = (values) => {
    const shares = getSharesFromValues(values)

    onChange && onChange(values, shares)
    setValues(values)
  }

  const ranger = useRanger({
    min: 0,
    max: 100,
    stepSize: 1,
    values,
    onDrag: handleDrag,
  })

  return [ { values, ...ranger }, setValues ]
}
