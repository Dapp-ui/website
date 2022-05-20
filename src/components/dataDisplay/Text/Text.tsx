import React from 'react'
import cx from 'classnames'

import s from './Text.module.scss'


export const stylesMap = {
  header: [ 'h1', 'h2', 'h3', 'h4' ],
  interface: [ 'i1', 'i2', 'i3', 'i4', 'i5' ],
  body: [ 'p1', 'p2' ],
  caption: [ 'c1', 'c2', 'c3', 'c4', 'c5' ],
  title: [ 't1', 't2' ],
} as const

export const styles = [
  ...stylesMap.header,
  ...stylesMap.interface,
  ...stylesMap.body,
  ...stylesMap.caption,
  ...stylesMap.title,
] as const

export const colors = [
  'brand-70',
  'brand-50',
  'gray-90',
  'gray-60',
  'gray-40',
  'gray-5',
  'accent-green-90',
  'accent-red-90',
] as const

export const aligns = [ 'left', 'center', 'right' ] as const

export type TextStyle = typeof styles[number]
export type TextColor = typeof colors[number]
export type TextAlign = typeof aligns[number]

export type TextProps = {
  children?: React.ReactNode,
  className?: string
  tag?: string
  style: TextStyle
  color?: TextColor
  align?: TextAlign
  html?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  dataTestId?: string
}

const Text: React.FunctionComponent<TextProps> = (props) => {
  let {
    children, className, tag = 'div',
    style, color, align,
    onClick, dataTestId,
  } = props

  if (onClick && tag !== 'button') {
    console.error('You can\'t use "onClick" without passing tag === "button". Create components ADA friendly!')
  }

  const textClassName = cx(s.text, className, {
    [s[style]]: style,
    [s[`c-${color}`]]: color,
    [`text-${align}`]: align,
  })

  return (
    React.createElement(tag, {
      className: textClassName,
      onClick,
      'data-testid': dataTestId,
    }, children)
  )
}

export default Text
