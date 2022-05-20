import React, { Children } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { LinkProps } from 'next/link'


type ActiveLinkProps = LinkProps & {
  activeClassName: string
  exact?: boolean
}

const ActiveLink: React.FunctionComponent<ActiveLinkProps> = (props) => {
  const { children, activeClassName, exact, ...rest } = props

  const { asPath } = useRouter()

  const child = Children.only(children) as React.ReactElement
  const childClassName = child.props.className || ''
  const url = String(rest.href || rest.as || '')

  const className =
    (exact ? url === asPath : new RegExp(url).test(asPath))
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName

  return (
    <Link {...rest}>
      {
        React.cloneElement(child, {
          className: className || null,
        })
      }
    </Link>
  )
}


export default ActiveLink
