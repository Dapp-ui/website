import React, { forwardRef, useCallback } from 'react'

import { Href } from 'components/navigation'


export type ButtonBaseProps = {
  // basic
  children?: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  // links
  to?: string // router link
  href?: string // external link
  toTab?: string // external link in new tab
  // misc
  disabled?: boolean
  loading?: boolean
  tag?: string
  type?: string
  dataTestId?: string
}

const ButtonBase = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonBaseProps>((props, ref) => {
  const {
    children, className,
    disabled, loading,
    to, toTab, href, onClick,
    tag = 'button', type = 'button',
    dataTestId,
  } = props

  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault()

      return
    }

    if (typeof onClick === 'function') {
      onClick(event)
    }
  }, [ loading, disabled, onClick ])

  let node: string | React.ElementType = tag

  let nodeProps: any = {
    ref,
    className,
    disabled,
    onClick: handleClick,
    'aria-busy': loading,
    'data-testid': dataTestId,
  }

  if (to || toTab || href) {
    node = Href

    nodeProps = {
      ...nodeProps,
      to,
      href,
      toTab,
    }
  }
  else if (tag === 'button' || tag === 'input') {
    nodeProps.type = type
  }
  else {
    nodeProps.role = 'button'
  }

  return React.createElement(
    node,
    nodeProps,
    children
  )
})


export default ButtonBase
