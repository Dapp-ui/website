import React, { useRef, useEffect, useCallback } from 'react'
import cx from 'classnames'

import { Icon } from 'components/ui'

import s from './NotificationBase.module.scss'


export type NotificationBaseProps = {
  className?: string
  closeNotification?: () => void
  onClick?: () => void
}

const NotificationBase: React.FunctionComponent<React.PropsWithChildren<NotificationBaseProps>> = (props) => {
  const { children, className, closeNotification, onClick } = props

  const nodeRef = useRef<HTMLDivElement>()

  const handleClose = useCallback(() => {
    nodeRef.current.style.marginTop = `${-1 * nodeRef.current.clientHeight}px`
    nodeRef.current.classList.add(s.closed)
    setTimeout(closeNotification, 300)
  }, [ closeNotification ])

  useEffect(() => {
    const timer = setTimeout(handleClose, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [ handleClose ])

  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick()
    }
    else {
      handleClose()
    }
  }, [ handleClose, onClick ])

  return (
    <div
      ref={nodeRef}
      className={cx(s.notification, className)}
      role="alert"
      data-testid="notification"
      onClick={handleClick}
    >
      <button
        className={s.closeButton}
        type="button"
        onClick={handleClick}
      >
        <Icon name="interface/close" size={12} />
      </button>
      {children}
    </div>
  )
}

export default NotificationBase
