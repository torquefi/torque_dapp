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
  externalOpen?: boolean
  wrapperClassName?: string
}

const Popover = ({
  className,
  content,
  placement = 'bottom-right',
  children,
  trigger = 'click',
  externalOpen,
  wrapperClassName,
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

  useEffect(() => {
    setOpen(false)
  }, [externalOpen])

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
          `${wrapperClassName} absolute transition-all` +
          ` ${
            isOpen
              ? 'z-[10] scale-100 opacity-100'
              : 'pointer-events-none scale-90 opacity-0'
          }` +
          ` ${placement === 'top-left' ? 'bottom-full left-0' : ''}` +
          ` ${
            placement === 'top' ? 'bottom-full left-1/2 -translate-x-1/2' : ''
          }` +
          ` ${placement === 'top-right' ? 'bottom-full right-0' : ''}` +
          ` ${placement === 'bottom-left' ? 'left-0 top-full' : ''}` +
          ` ${
            placement === 'bottom' ? 'left-1/2 top-full -translate-x-1/2' : ''
          }` +
          ` ${placement === 'bottom-right' ? 'right-0 top-full' : ''}` +
          ` ${placement === 'left-top' ? 'right-full top-0' : ''}` +
          ` ${
            placement === 'left' ? 'right-full top-1/2 -translate-y-1/2' : ''
          }` +
          ` ${placement === 'left-bottom' ? 'bottom-0 right-full' : ''}` +
          ` ${placement === 'right-top' ? 'left-full top-0' : ''}` +
          ` ${
            placement === 'right' ? 'left-full top-1/2 -translate-y-1/2' : ''
          }` +
          ` ${placement === 'right-bottom' ? 'bottom-0 left-full' : ''}`
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={
            'rounded-[8px] border border-[#EAEAEA] bg-[#FCFAFF] p-[6px] text-[#030303] dark:border-[#1D1D1D] dark:bg-[#030303] dark:text-white' +
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
