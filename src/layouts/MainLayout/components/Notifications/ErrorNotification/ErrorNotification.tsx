import React from 'react'

import PlainNotification from '../PlainNotification/PlainNotification'
import type { PlainNotificationProps } from '../PlainNotification/PlainNotification'

import s from './ErrorNotification.module.scss'


const defaultText = 'Something went wrong. Please <a href="https://github.com/ETHHackathon2022/website/issues/new">create a Issue</a>.'

type ErrorNotificationProps = Partial<PlainNotificationProps>

const ErrorNotification: React.FunctionComponent<ErrorNotificationProps> = (props) => {
  const { title = 'Error', text = defaultText } = props

  return (
    <PlainNotification
      className={s.errorNotification}
      title={title}
      text={text}
    />
  )
}

export default ErrorNotification
