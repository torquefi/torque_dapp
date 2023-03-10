import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      marquee: Marquee
    }
  }
}

interface Marquee
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  id: string
  height?: Number
  behavior: string
  direction: string
  scrollamount?: Number
}
