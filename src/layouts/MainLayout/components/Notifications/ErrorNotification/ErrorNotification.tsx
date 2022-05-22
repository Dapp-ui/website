import React from 'react'

import PlainNotification from '../PlainNotification/PlainNotification'
import type { PlainNotificationProps } from '../PlainNotification/PlainNotification'

import s from './ErrorNotification.module.scss'


type ErrorNotificationProps = Partial<PlainNotificationProps>

const ErrorNotification: React.FunctionComponent<ErrorNotificationProps> = (props) => {
  const { title = 'Error', text = 'Something went wrong' } = props

  return (
    <PlainNotification
      className={s.errorNotification}
      title={title}
      text={text}
    />
  )
}

export default ErrorNotification
