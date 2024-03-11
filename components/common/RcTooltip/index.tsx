import { useEffect, useRef, useState } from 'react'
import Tooltip from 'rc-tooltip'

type Placement =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'
  | 'leftTop'
  | 'left'
  | 'leftBottom'
  | 'rightTop'
  | 'right'
  | 'rightBottom'

type Trigger = 'hover' | 'click'

interface PopoverProps {
  className?: string
  content?: any
  placement?: Placement
  children?: any
  trigger?: Trigger
  showArrow?: boolean
}

const RcTooltip = ({
  className,
  content,
  placement = 'rightBottom',
  children,
  trigger = 'click',
  showArrow = false,
}: PopoverProps) => {
  return (
    <Tooltip
      showArrow={showArrow}
      placement={placement}
      trigger={[trigger]}
      overlay={
        <div
          className={
            'rounded-[8px] border border-[#EAEAEA] bg-[#FCFAFF] p-[6px] text-[#030303] dark:border-[#1D1D1D] dark:bg-[#030303] dark:text-white' +
            ` ${className}`
          }
        >
          {content}
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}
export default RcTooltip
