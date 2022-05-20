import React from 'react'
import { useFieldState } from 'formular'
import type { Field } from 'formular'
import cx from 'classnames'

import s from './Chip.module.scss'


type SharedProps = OnlyOne<{
  className?: string
  children: React.ReactNode
  title: string
}> & {
  value: string
  canBeUnselected?: boolean
}

type ChipBaseProps = SharedProps & {
  active?: boolean
  onClick: (value: string) => void
}

export const ChipBase: React.FC<ChipBaseProps> = (props) => {
  const { children, className, title, value, active, canBeUnselected = true, onClick } = props

  const rootClassName = cx(s.chip, className, {
    [s.active]: active,
    [s.canBeUnselected]: canBeUnselected,
  })

  const content = title || children

  const handleClick = () => {
    if (!active || canBeUnselected) {
      onClick(value)
    }
  }

  return (
    <button
      className={rootClassName}
      onClick={handleClick}
    >
      {content}
    </button>
  )
}

type ChipProps = SharedProps & {
  field: Field<string>
}

const Chip: React.FC<ChipProps> = (props) => {
  const { field, ...rest } = props

  const { value } = useFieldState(field)

  const handleClick = (value) => {
    field.set(value)
  }

  return (
    <ChipBase
      {...rest}
      active={value === rest.value}
      onClick={handleClick}
    />
  )
}

export default Chip
