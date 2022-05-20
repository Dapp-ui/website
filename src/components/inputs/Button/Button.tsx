import React, { forwardRef } from 'react'
import cx from 'classnames'

import { Icon } from 'components/ui'
import type { IconName } from 'components/ui'
import { ButtonBase } from 'components/inputs'
import type { ButtonBaseProps } from 'components/inputs'

import s from './Button.module.scss'


const iconSizes = {
  20: 10,
  32: 14,
  44: 16,
  56: 18,
}

export const widths = [] as const
export const sizes = [ 20, 32, 44, 48, 56 ] as const
export const styles = [ 'primary', 'secondary', 'tertiary' ] as const

type ButtonWidth = typeof widths[number]
export type ButtonSize = typeof sizes[number]
type ButtonStyle = typeof styles[number]

export type ButtonProps = ButtonBaseProps & OnlyOne<{
  children: React.ReactNode | undefined
  title: string
  leftIcon?: IconName
  rightIcon?: IconName
  size: ButtonSize
  width?: ButtonWidth
  style?: ButtonStyle
  fullWidth?: boolean
  fullWidthOnMobile?: boolean
  dataTestId?: string
}, 'children' | 'title'>

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>((props, ref) => {
  let {
    children, className, title, width, size, style = 'primary',
    loading, disabled, fullWidth, fullWidthOnMobile,
    leftIcon, rightIcon,
    ...rest
  } = props

  if (loading) {
    leftIcon = 'interface/spinner'
  }

  const rootClassName = cx(s.button, className, 'button', s[`size-${size}`], {
    [s[style]]: s[style],
    [s[`w-${width}`]]: width,
    'w-full': fullWidth,
    [s.fullWidthOnMobile]: fullWidthOnMobile,
    [s.disabled]: loading || disabled,
  })

  const content = title || children
  const iconSize = iconSizes[size]

  return (
    <ButtonBase
      ref={ref}
      className={rootClassName}
      loading={loading}
      disabled={disabled}
      {...rest}
    >
      <div className={s.content}>
        {
          leftIcon && (
            <Icon
              className="mr-12"
              name={leftIcon}
              size={iconSize}
            />
          )
        }
        {content}
        {
          rightIcon && (
            <Icon
              className="ml-12"
              name={rightIcon}
              size={iconSize}
            />
          )
        }
      </div>
    </ButtonBase>
  )
})


export default Button
