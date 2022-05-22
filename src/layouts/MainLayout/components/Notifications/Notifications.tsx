import React from 'react'
import { Notifications as NotificationsConductor } from '@locmod/notifications'

import PlainNotification from './PlainNotification/PlainNotification'
import ErrorNotification from './ErrorNotification/ErrorNotification'

import s from './Notifications.module.scss'


export const templates = {
  'plain': PlainNotification,
  'error': ErrorNotification,
} as const

const Notifications = () => (
  <NotificationsConductor
    className={s.notifications}
    templates={templates}
  />
)

export default React.memo(Notifications)
