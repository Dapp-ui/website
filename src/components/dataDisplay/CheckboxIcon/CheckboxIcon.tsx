import React from 'react'
import cx from 'classnames'

import { Icon } from 'components/ui'

import s from './CheckboxIcon.module.scss'


type CheckboxIconProps = {
  className?: string
  active?: boolean
  disabled?: boolean
}

const CheckboxIcon: React.FunctionComponent<CheckboxIconProps> = (props) => {
  const { className, active, disabled } = props

  const rootClassName = cx(s.icon, 'flex flex-none items-center justify-center radius-5', className, {
    [s.active]: active,
    [s.disabled]: disabled,
  })

  return (
    <div className={rootClassName}>
      <Icon name="interface/checkmark" size={12} />
    </div>
  )
}


export default CheckboxIcon
