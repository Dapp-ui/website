import React from 'react'
import cx from 'classnames'
import { Menu } from '@headlessui/react'

import type { DropdownProps } from '../../Dropdown'

import s from './ExceptMobile.module.scss'


const ExceptMobile: React.FC<DropdownProps> = (props) => {
  const { children, className, dropListClassName, content, placement = 'bottomLeft' } = props

  const buttonClassName = cx({
    [s.disabled]: !content,
  })

  const menuClassName = cx(s.menu, dropListClassName, {
    [s[placement]]: placement,
  })

  return (
    <Menu as="div" className={cx('relative flex', className)}>
      <Menu.Button aria-label="Menu" className={buttonClassName}>
        {
          ({ open: isOpened }) => {
            if (typeof children === 'function') {
              return children({ isOpened })
            }

            return children
          }
        }
      </Menu.Button>
      <Menu.Items className={menuClassName}>
        {content}
      </Menu.Items>
    </Menu>
  )
}

export default ExceptMobile
