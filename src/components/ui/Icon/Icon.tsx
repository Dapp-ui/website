import React from 'react'
import cx from 'classnames'

import type { IconName } from './icons'

import InlineSvg from '../InlineSvg/InlineSvg'

import s from './Icon.module.scss'


export const sizes = [ 12, 14, 16, 18, 20, 24 ]
export const colors = [ 'brand-50', 'gray-40', 'gray-60' ] as const

export type IconSize = typeof sizes[number]
export type IconColor = typeof colors[number]

type IconProps = {
  className?: string
  name: IconName
  size?: IconSize
  color?: IconColor
  'aria-describedby'?: string
}

const IconBase: React.FunctionComponent<IconProps> = (props) => {
  const { className, name, size, color, 'aria-describedby': ariaDescribedby } = props

  const rootClassName = cx(s.icon, className, s[name], s[`size-${size}`], {
    [`color-${color}`]: color,
  })

  return (
    <InlineSvg
      className={rootClassName}
      src={`/images/icons/${name}.svg`}
      aria-describedby={ariaDescribedby}
    />
  )
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  const { size, ...rest } = props

  return <IconBase {...rest} size={size} />
}


export default Icon
