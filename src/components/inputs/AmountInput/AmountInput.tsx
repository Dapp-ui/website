import React, { useRef, useEffect } from 'react'
import { Field, useField, useFieldState } from 'formular'
import cx from 'classnames'

import { Text } from 'components/dataDisplay'
import { Chip } from 'components/inputs'

import s from './AmountInput.module.scss'


const chips = [ 25, 50, 75, 100 ]

const Chips = ({ amountField, maxValue }) => {
  const percentageField = useField<string>()

  useEffect(() => {
    if (parseFloat(maxValue)) {
      const handleAmountChange = (amount: string) => {
        const currPercentage = parseInt(percentageField.state.value)

        if (!currPercentage) {
          return
        }

        const percentage = Math.round(parseFloat(amount) / parseFloat(maxValue) * 100)

        if (percentage !== currPercentage) {
          percentageField.set(null)
        }
      }

      const handlePercentageChange = (value) => {
        const newAmount = String(parseFloat(maxValue) * parseInt(value) / 100)

        amountField.set(newAmount)
      }

      amountField.on('change', handleAmountChange)
      percentageField.on('change', handlePercentageChange)

      return () => {
        amountField.off('change', handleAmountChange)
        percentageField.off('change', handlePercentageChange)
      }
    }
  }, [ maxValue ])

  return (
    <div className={cx(s.chips, 'mt-12')}>
      {
        chips.map((value) => (
          <Chip
            key={value}
            title={`${value}%`}
            value={String(value)}
            field={percentageField}
          />
        ))
      }
    </div>
  )
}

export type InputProps = {
  className?: string
  field: Field<string | number>
  pattern?: string
  label: string
  errorLabel?: string
  placeholder?: string
  maxValue?: string | number
  focusOnInit?: boolean
  disabled?: boolean
  withChips?: boolean
  validateOnBlur?: boolean
  onBlur?: (value: string) => void
  onFocus?: (value: string) => void
  onChange?: (value: string) => void
  dataTestId?: string
}

const AmountInput: React.FunctionComponent<InputProps> = (props) => {
  let {
    className, field, pattern = '^(|0|0\\.[0-9]*|[1-9][0-9]*\\.?[0-9]*)$',
    label, errorLabel, placeholder, maxValue,
    focusOnInit, disabled, validateOnBlur = true, withChips,
    onFocus, onBlur, onChange, dataTestId,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const { value, error } = useFieldState<string | number>(field)

  const isMaxValue = maxValue === value

  useEffect(() => {
    if (focusOnInit) {
      inputRef.current.focus()
    }
  }, [])

  const handleFocus = (event) => {
    let value = event.target.value

    if (typeof onFocus === 'function') {
      onFocus(value)
    }
  }

  const handleBlur = async (event) => {
    let value = event.target.value

    if (validateOnBlur) {
      // @ts-ignore
      await field.validate()
    }

    if (typeof onBlur === 'function') {
      onBlur(value)
    }
  }

  const handleChange = (event) => {
    let value = event.target.value

    if (pattern && !new RegExp(pattern).test(value)) {
      return
    }

    field.set(value)

    if (typeof onChange === 'function') {
      onChange(value)
    }
  }

  const handleMaxButtonClick = () => {
    if (!disabled) {
      field.set(String(maxValue).replace(/\.0+$/, ''))
    }
  }

  const isFilled = value !== ''
  const isErrored = Boolean(error || errorLabel)

  const inputClassName = cx(s.input, {
    [s.filled]: isFilled,
    [s.errored]: isErrored,
    [s.disabled]: disabled,
    [s.withMaxButton]: Boolean(maxValue),
  })

  return (
    <div className={className}>
      <div className={s.root}>
        {
          Boolean(maxValue) && (
            <button
              className={cx(s.maxButton, { [s.active]: isMaxValue })}
              data-testid="max-amount-btn"
              onClick={handleMaxButtonClick}
            >
              Max
            </button>
          )
        }
        <Text
          className={s.label}
          style="p2"
          color={errorLabel ? 'attention' : '300'}
        >
          {errorLabel || label}
        </Text>
        <input
          ref={inputRef}
          className={inputClassName}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-testid={dataTestId}
        />
      </div>
      {
        withChips && (
          <Chips amountField={field} maxValue={maxValue} />
        )
      }
    </div>
  )
}


export default React.memo(AmountInput)
