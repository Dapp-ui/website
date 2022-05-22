import React, { useMemo } from 'react'
import cx from 'classnames'

import s from './Bone.module.scss'


type BoneProps = {
  className?: string
  w?: number
  h?: number
  pw?: number // percent width
  ph?: number // percent height
  aspect?: number // w / h, e.g. 1.33
  rounded?: boolean
  inline?: boolean
  style?: Partial<React.HTMLProps<any>['style']>
}

const Bone: React.FunctionComponent<BoneProps> = (props) => {
  const {
    className,
    w: width, h: height,
    pw: percentWidth, ph: percentHeight,
    aspect, rounded = true, inline, style,
  } = props

  const rootStyle = useMemo(() => {
    const rootStyle: any = {}

    if (width) {
      rootStyle.width = rootStyle.minWidth = `${width}px`
    }

    if (percentWidth) {
      rootStyle.width = rootStyle.minWidth = `${percentWidth}%`
    }

    if (height) {
      rootStyle.height = rootStyle.minHeight = `${height}px`
    }

    if (percentHeight) {
      rootStyle.height = rootStyle.minHeight = `${percentHeight}%`
    }

    return {
      ...rootStyle,
      ...style,
    }
  }, [ width, height, percentWidth, percentHeight ])

  const rootClassName = cx(s.bone, className, {
    'radius-full': rounded,
    'inline-block': inline,
  })

  return (
    <div
      className={rootClassName}
      style={rootStyle}
    >
      {
        aspect && (
          <div style={{ paddingTop: `${Math.round(100 / aspect)}%` }} />
        )
      }
    </div>
  )
}


export default React.memo(Bone)
