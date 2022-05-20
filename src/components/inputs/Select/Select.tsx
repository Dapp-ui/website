import React from 'react'
import { Field, useFieldState } from 'formular'
import cx from 'classnames'

import { Text } from 'components/dataDisplay'
import { Icon } from 'components/ui'

import s from './Select.module.scss'


const sizes = [ 36, 44, 56 ] as const

type SelectSize = typeof sizes[number]

export type SelectOption = {
  title: string
  value: string
}

export type SelectProps = {
  className?: string
  field: Field<string>
  size: SelectSize
  placeholder?: string
  options: SelectOption[]
  disabled?: boolean
  subMessage?: string
  subNode?: React.ReactElement
  onChange?: (value: string) => void
  dataTestId?: string
}

const Select: React.FunctionComponent<SelectProps> = (props) => {
  const {
    className, field, size, placeholder, options, disabled,
    subMessage, subNode,
    onChange, dataTestId,
  } = props

  const { value, error } = useFieldState<string>(field)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value

    field.set(value)

    if (typeof onChange === 'function') {
      onChange(value)
    }
  }

  const isFilled = value !== '' && value !== null
  const isErrored = Boolean(error)

  const rootClassName = cx(s.root, s[`size-${size}`], className)

  const selectClassName = cx(s.select, {
    [s.filled]: isFilled,
    [s.errored]: isErrored,
    [s.disabled]: disabled,
  })

  return (
    <div className={rootClassName}>
      <div className={s.arrow}>
        <Icon name="interface/chevron_down" size={16} />
      </div>
      <select
        className={selectClassName}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        data-testid={dataTestId}
      >
        {
          !value && (
            <option className={s.placeholder} value={null}>{placeholder}</option>
          )
        }
        {
          options.map(({ title, value }) => (
            <option key={value} value={value}>{title}</option>
          ))
        }
      </select>
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
                <Text style="t2" color="attention">{error}</Text>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Select)
