import React, { useRef, useEffect } from 'react'
import { Field, useFieldState } from 'formular'
import cx from 'classnames'

import { Text } from 'components/dataDisplay'

import s from './Input.module.scss'


const sizes = [ 36, 44, 56 ] as const

type InputSize = typeof sizes[number]

export type InputProps = {
  className?: string
  field: Field<string | number>
  size: InputSize
  pattern?: string
  placeholder?: string
  focusOnInit?: boolean
  disabled?: boolean
  validateOnBlur?: boolean
  subMessage?: string
  subNode?: React.ReactElement
  onBlur?: (value: string) => void
  onFocus?: (value: string) => void
  onChange?: (value: string) => void
  dataTestId?: string
}

const Input: React.FunctionComponent<InputProps> = (props) => {
  let {
    className, field, size, pattern, placeholder,
    focusOnInit, disabled, validateOnBlur = true,
    subMessage, subNode,
    onFocus, onBlur, onChange, dataTestId,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const { value, error } = useFieldState<string | number>(field)

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

  const isFilled = value !== ''
  const isErrored = Boolean(error)

  const rootClassName = cx(s.root, s[`size-${size}`], className)

  const inputClassName = cx(s.input, {
    [s.filled]: isFilled,
    [s.errored]: isErrored,
    [s.disabled]: disabled,
  })

  return (
    <div className={rootClassName}>
      <input
        data-testid={dataTestId}
        className={inputClassName}
        value={value}
        ref={inputRef}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {
        (subMessage || subNode || isErrored) && (
          <div className="mt-4 pl-4">
            {
              subMessage && !isErrored && (
                <Text style="t2">{subMessage}</Text>
              )
            }
            {
              subNode && !isErrored && (
                subNode
              )
            }
            {
              isErrored && (
                <Text style="t2" color="accent-red-90">{error}</Text>
              )
            }
          </div>
        )
      }
    </div>
  )
}


export default React.memo(Input)
