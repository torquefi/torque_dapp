import { Placement } from '@popperjs/core'
import Tippy from '@tippyjs/react'
import { MutableRefObject } from 'react'
import { forceCheck } from 'react-lazyload'

export interface PopoverProps extends ReactProps {
  reference: MutableRefObject<HTMLElement>
  trigger?: 'hover' | 'click'
  hideOnClickOutside?: boolean // if false, to close popover you need to click on the reference
  placement?: Placement
  theme?: 'light' | 'light-border' | 'material' | 'translucent'
  arrow?: boolean
  maxWidth?: string | number
  animation?: 'shift-away-subtle' | 'fade'
  onShown?: (val: boolean) => any
}

export function Popover({
  reference,
  trigger = 'hover',
  placement = 'auto',
  theme = 'light',
  arrow = true,
  maxWidth = 'none',
  animation = 'shift-away-subtle',
  hideOnClickOutside = true,
  ...props
}: PopoverProps) {
  const root =
    typeof window !== 'undefined'
      ? document.getElementById('popover-root')
      : null

  const getTrigger = () => {
    return trigger == 'hover' ? 'mouseenter focus' : 'click'
  }

  return (
    <Tippy
      content={props.children}
      placement={placement}
      theme={theme}
      reference={reference}
      allowHTML={true}
      interactive={true}
      animation={animation}
      appendTo={root}
      arrow={arrow}
      maxWidth={maxWidth}
      trigger={getTrigger()}
      hideOnClick={hideOnClickOutside || 'toggle'}
      onShown={() => {
        props.onShown ? props.onShown(true) : false
        setTimeout(() => forceCheck(), 100)
      }}
    ></Tippy>
  )
}
