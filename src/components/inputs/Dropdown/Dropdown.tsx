import React from 'react'
import { useMedia } from 'hooks'

import ExceptMobile from './views/ExceptMobile/ExceptMobile'
import Mobile from './views/Mobile/Mobile'

import s from './Dropdown.module.scss'


export type DropdownProps = {
  dropListClassName?: string
  children: React.ReactElement | (({ isOpened: boolean }) => React.ReactElement)
  name: string
  withCaret?: boolean
  withArrow?: boolean
  content?: any
  className?: string
  placement?: 'bottomLeft' | 'bottomRight' | 'center' | 'arrowCenter'
}

type DropdownType = React.FC<DropdownProps> & {
  Separator: React.FC
}

const Dropdown: DropdownType = (props) => {
  const { isMobile } = useMedia()

  return React.createElement(isMobile ? Mobile : ExceptMobile, props)
}

const Separator: React.VFC = () => {
  return <div className={s.separator} />
}

Dropdown.Separator = Separator

export default Dropdown
