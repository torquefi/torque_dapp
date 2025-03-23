"use client"

import React, { useEffect, useRef, useState } from "react"

interface HoverIndicatorGridProps {
  children: React.ReactNode
  rows?: number
  cols?: number
  className?: string
  activeIndex?: number
  indicatorClassName?: string
}

const HoverIndicatorGrid = ({
  children,
  rows = 2,
  cols = 2,
  className = "",
  activeIndex = -1,
  indicatorClassName = "",
}: HoverIndicatorGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState(activeIndex)
  const [indicatorStyle, setIndicatorStyle] = useState({})

  useEffect(() => {
    if (containerRef.current && hoveredIndex >= 0) {
      const gridItems = containerRef.current.querySelectorAll(".grid-item")
      if (hoveredIndex < gridItems.length) {
        const item = gridItems[hoveredIndex] as HTMLElement
        setIndicatorStyle({
          width: `${item.offsetWidth}px`,
          height: `${item.offsetHeight}px`,
          transform: `translate(${item.offsetLeft}px, ${item.offsetTop}px)`,
        })
      }
    }
  }, [hoveredIndex])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="grid-item"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(activeIndex)}
        >
          {child}
        </div>
      ))}
      {hoveredIndex >= 0 && (
        <div
          className={`absolute rounded-lg bg-[#f5f5f5] dark:bg-[#1A1A1A] transition-all duration-200 ease-in-out ${indicatorClassName}`}
          style={indicatorStyle}
        />
      )}
    </div>
  )
}

export default HoverIndicatorGrid

