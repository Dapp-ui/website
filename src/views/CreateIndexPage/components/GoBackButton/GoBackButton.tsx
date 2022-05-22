import React from 'react'

import { IconButton } from 'components/inputs'

import s from './GoBackButton.module.scss'


type GoBackButtonProps = {
  onClick: () => void
}

const GoBackButton: React.FC<GoBackButtonProps> = ({ onClick }) => {

  return (
    <IconButton
      className={s.button}
      icon="interface/chevron_left"
      size={24}
      onClick={onClick}
    />
  )
}

export default GoBackButton
