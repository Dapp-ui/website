import React, { useMemo } from 'react'
import { modalVisibility, openModal } from '@locmod/modal'
import type { ModalVisibilityProps } from '@locmod/modal'

import { PlainModal } from 'components/feedback'
import type { DropdownProps } from '../../Dropdown'
import { Icon } from 'components/ui'


const DropdownModal: React.FC<ModalVisibilityProps> = (props) => {
  const { closeModal, children } = props

  return (
    <PlainModal
      withCloseButton={false}
      closeModal={closeModal}
    >
      {children}
    </PlainModal>
  )
}

const Mobile: React.FC<DropdownProps> = ({ name, content, children, withCaret = true }) => {
  const Modal = modalVisibility(name, DropdownModal) as React.FC
  const openDropdownModal = () => openModal(name)

  const child = useMemo(() => {
    if (typeof children === 'function') {
      return children({ isOpened: false })
    }

    return (
      <div className="flex items-center">
        {children}
        {withCaret && content && <Icon name="interface/chevron_down" />}
      </div>
    )
  }, [ children ])

  return (
    <>
      {
        React.createElement('div', {
          onClick: content && openDropdownModal,
        }, child)
      }
      <Modal>
        {content}
      </Modal>
    </>
  )
}

export default Mobile
