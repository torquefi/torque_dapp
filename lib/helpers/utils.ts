import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function shortenAddress(address: string) {
  return (
    address?.substring(0, 4) +
    '...' +
    address?.substring(address.length - 4, address.length)
  )
}

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes))
