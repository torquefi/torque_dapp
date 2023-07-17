import { useEffect, useMemo, useRef, useState } from 'react'

interface HoverIndicatorProps {
  activeIndex?: number
  className?: string
  indicatorClassName?: string
  children?: any
  direction?: 'horizontal' | 'vertical'
  divider?: boolean
}

export default function HoverIndicator({
  activeIndex = null,
  className = '',
  indicatorClassName = '',
  children = null,
  direction = 'horizontal',
  divider = false,
}: HoverIndicatorProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(null)
  const container = useRef<HTMLDivElement>(null)
  const indicator = useRef<HTMLDivElement>(null)

  const childrenArr = useMemo(() => {
    if (children === null) {
      return []
    }
    if (!Array.isArray(children)) {
      return [children]
    }
    return children
  }, [children])

  useEffect(() => {
    setActiveTabIndex(activeIndex)
  }, [activeIndex])

  useEffect(() => {
    const handleUpdateIndicatorPosition = () => {
      if (!indicator.current || !container.current) {
        return
      }
      if (direction === 'horizontal') {
        const menuRect = container.current.getBoundingClientRect()
        const indicatorWidth = menuRect.width / (childrenArr?.length || 1)
        indicator.current.style.width = `${indicatorWidth}px`
        indicator.current.style.height = `${100}%`
        if (activeTabIndex === null) {
          indicator.current.style.opacity = '0'
        } else {
          const top = indicatorWidth * activeTabIndex
          indicator.current.style.left = `${top}px`
          indicator.current.style.opacity = '1'
        }
      }
      if (direction === 'vertical') {
        const menuRect = container.current.getBoundingClientRect()
        const indicatorHeight = menuRect.height / (childrenArr?.length || 1)
        indicator.current.style.height = `${indicatorHeight}px`
        indicator.current.style.width = `${100}%`
        if (activeTabIndex === null) {
          indicator.current.style.opacity = '0'
        } else {
          const top = indicatorHeight * activeTabIndex
          indicator.current.style.top = `${top}px`
          indicator.current.style.opacity = '1'
        }
      }
    }
    handleUpdateIndicatorPosition()
    window.addEventListener('resize', handleUpdateIndicatorPosition)
    return () => {
      window.removeEventListener('resize', handleUpdateIndicatorPosition)
    }
  }, [activeTabIndex])

  return (
    <div
      ref={container}
      className={
        'relative h-full w-full' +
        ` ${direction === 'horizontal' ? 'flex' : ''}` +
        ` ${className}`
      }
    >
      <div
        className={
          'pointer-events-none absolute w-full rounded-[6px]  bg-[#F4F4F4] from-[#1c1c1c] to-[#101010] transition-all duration-300 dark:bg-[#1D1D1D]' +
          ` ${direction === 'horizontal' ? 'inset-y-0' : ''}` +
          ` ${direction === 'vertical' ? 'inset-x-0' : ''}` +
          ` ${indicatorClassName}`
        }
        ref={indicator}
      />
      {childrenArr.map((item, i) => (
        <div
          className="relative w-full"
          key={i}
          onMouseEnter={() => setActiveTabIndex(i)}
          onMouseLeave={() => setActiveTabIndex(activeIndex ?? null)}
        >
          {divider && i !== 0 && (
            <div className="dark:bg-gradient-divider absolute inset-x-0 top-[-0.5px] h-[1px]" />
          )}
          {item}
        </div>
      ))}
    </div>
  )
}
