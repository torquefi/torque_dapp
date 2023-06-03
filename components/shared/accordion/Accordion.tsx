import { MutableRefObject, useRef } from 'react'

type AccordionProps = ReactProps & {
  isOpen: boolean
}
export function Accordion(props: AccordionProps) {
  const ref: MutableRefObject<HTMLDivElement> = useRef()
  return (
    <div
      className={`relative max-h-0 overflow-hidden transition-all ${
        props.className || ''
      }`}
      ref={ref}
      style={{
        maxHeight:
          props.isOpen && ref.current
            ? ref.current.scrollHeight + 1000 + 'px'
            : '',
      }}
    >
      {props.children}
    </div>
  )
}
