import React from 'react'
import cx from 'classnames'

import { Icon } from 'components/ui'
import type { IconName, IconSize, IconColor } from 'components/ui'

import s from './IconButton.module.scss'


type IconButtonProps = React.HTMLProps<HTMLButtonElement> & {
  icon: IconName
  size: IconSize
  color?: IconColor
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { className, icon, size, onClick } = props

  return (
    <button
      className={cx(s.iconButton, className)}
      type="button"
      onClick={onClick}
    >
      <Icon name={icon} size={size} />
    </button>
  )
}


export default IconButton
