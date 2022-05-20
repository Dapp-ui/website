import React, { useCallback } from 'react'
import { Field, useFieldState } from 'formular'
import cx from 'classnames'

import { CheckboxIcon } from 'components/dataDisplay'

import s from './Checkbox.module.scss'


export type CheckboxProps = {
  className?: string
  field: Field<any>
  value?: any
  disabled?: boolean
  fullWidth?: boolean
  'aria-label'?: string
  dataTestId?: string
}

const Checkbox: React.FunctionComponent<CheckboxProps> = (props) => {
  const {
    children, className, field, value,
    disabled, fullWidth,
    'aria-label': ariaLabel, dataTestId,
  } = props

  const state = useFieldState(field)

  const isCheckboxGroup = Array.isArray(state.value)
  const isChecked = isCheckboxGroup ? state.value.includes(value) : state.value

  const rootClassName = cx(s.root, className, {
    [s.disabled]: disabled,
    'w-full': fullWidth,
  })

  const handleClick = useCallback(() => {
    // checkbox group
    if (Array.isArray(state.value)) {
      if (state.value.includes(value)) {
        field.set(state.value.filter((v) => v !== value))
      }
      else {
        field.set([ ...state.value, value ])
      }
    }
    // single checkbox
    else {
      field.set(!state.value)
    }
  }, [ field, state.value, value ])

  return (
    <button
      className={rootClassName}
      role="checkbox"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-checked={value}
      data-testid={dataTestId}
      onClick={handleClick}
    >
      <CheckboxIcon active={isChecked} disabled={disabled} />
      {children}
    </button>
  )
}


export default Checkbox
