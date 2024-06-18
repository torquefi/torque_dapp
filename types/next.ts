import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode
}
