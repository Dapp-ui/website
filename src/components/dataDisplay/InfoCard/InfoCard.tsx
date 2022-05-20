import React from 'react'
import cx from 'classnames'

import { Text } from 'components/dataDisplay'
import { Icon } from 'components/ui'

import s from './InfoCard.module.scss'


type InfoCardProps = OnlyOne<{
  children?: React.ReactElement
  className?: string
  title: string
  value: string
  small?: boolean
  isFetching?: boolean
}, 'children' | 'value'>

const InfoCard: React.FC<InfoCardProps> = (props) => {
  const { children, className, title, value, small, isFetching } = props

  return (
    <div className={cx(s.card, className, { [s.small]: small })}>
      <div className="flex items-center justify-between">
        <Text message={title} style="p1" color="gray-60" />
      </div>
      <div className="flex items-start mt-auto">
        {
          children || (
            <>
              {
                isFetching ? (
                  <Icon name="interface/spinner" size={24} />
                ) : (
                  <Text message={value} style={small ? 'h4' : 'h3'} color="gray-90" />
                )
              }
            </>
          )
        }
      </div>
    </div>
  )
}

export default InfoCard
