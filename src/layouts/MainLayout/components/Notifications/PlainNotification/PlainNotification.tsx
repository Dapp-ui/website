import React from 'react'

import NotificationBase from '../NotificationBase/NotificationBase'
import type { NotificationBaseProps } from '../NotificationBase/NotificationBase'

import s from './PlainNotification.module.scss'


export type PlainNotificationProps = NotificationBaseProps & {
  title: string
  text: string
}

const PlainNotification: React.FunctionComponent<PlainNotificationProps> = (props) => {
  const { className, title, text, closeNotification } = props

  return (
    <NotificationBase className={className} closeNotification={closeNotification}>
      <div className={s.title}>{title}</div>
      <div className={s.text} dangerouslySetInnerHTML={{ __html: text }} />
    </NotificationBase>
  )
}


export default PlainNotification
