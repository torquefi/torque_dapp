import { useEffect, useRef, useState } from 'react'

type Placement =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'left-top'
  | 'left'
  | 'left-bottom'
  | 'right-top'
  | 'right'
  | 'right-bottom'

type Trigger = 'hover' | 'click'

interface PopoverProps {
  className?: string
  content?: any
  placement?: Placement
  children?: any
  trigger?: Trigger
}

const Popover = ({
  className,
  content,
  placement = 'bottom-right',
  children,
  trigger = 'click',
}: PopoverProps) => {
  const [isOpen, setOpen] = useState(false)

  const popoverContainerRef = useRef(null)

  const isTriggerClick = trigger === 'click'
  const isTriggerHover = trigger === 'hover'

  function closeMoreMenu(e: MouseEvent) {
    if (
      e.target !== popoverContainerRef.current &&
      !popoverContainerRef.current?.contains(e.target as Node)
    ) {
      setOpen(false)
    }
  }

  useEffect(
    function () {
      if (isTriggerClick) {
        window.addEventListener('click', closeMoreMenu)
      }
      return () => {
        if (isTriggerClick) {
          window.removeEventListener('click', closeMoreMenu)
        }
      }
    },
    [isTriggerClick]
  )

  return (
    <div
      ref={popoverContainerRef}
      className="relative"
      onClick={() => isTriggerClick && setOpen(!isOpen)}
      onMouseEnter={() => isTriggerHover && setOpen(true)}
      onMouseLeave={() => isTriggerHover && setOpen(false)}
    >
      {children}
      <div
        className={
          `absolute transition-all` +
          ` ${
            isOpen
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-90 opacity-0'
          }` +
          ` ${placement === 'top-left' ? 'bottom-full left-0' : ''}` +
          ` ${
            placement === 'top' ? 'bottom-full left-1/2 -translate-x-1/2' : ''
          }` +
          ` ${placement === 'top-right' ? 'bottom-full right-0' : ''}` +
          ` ${placement === 'bottom-left' ? 'top-full left-0' : ''}` +
          ` ${
            placement === 'bottom' ? 'top-full left-1/2 -translate-x-1/2' : ''
          }` +
          ` ${placement === 'bottom-right' ? 'top-full right-0' : ''}` +
          ` ${placement === 'left-top' ? 'right-full top-0' : ''}` +
          ` ${
            placement === 'left' ? 'right-full top-1/2 -translate-y-1/2' : ''
          }` +
          ` ${placement === 'left-bottom' ? 'right-full bottom-0' : ''}` +
          ` ${placement === 'right-top' ? 'left-full top-0' : ''}` +
          ` ${
            placement === 'right' ? 'left-full top-1/2 -translate-y-1/2' : ''
          }` +
          ` ${placement === 'right-bottom' ? 'left-full bottom-0' : ''}`
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={
            'rounded-[8px] text-[#030303] dark:text-white border border-[#EAEAEA] dark:border-[#1D1D1D] bg-[#FCFAFF] dark:bg-[#030303] p-[6px]' +
            ` ${className}`
          }
        >
          {content}
        </div>
      </div>
    </div>
  )
}
export default Popover
