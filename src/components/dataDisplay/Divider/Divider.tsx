import React, { FC } from 'react'
import cx from 'classnames'

import s from './Divider.module.scss'


type DividerProps = {
  className?: string
}

const Divider: FC<DividerProps> = ({ className }) => {
  return (
    <div className={cx(s.divider, className)} />
  )
}

export default Divider
