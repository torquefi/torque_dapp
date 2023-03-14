import { toHumanRead } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

interface CurrencySwitchProps {
  tokenSymbol: string
  tokenValue: number
  usdDefault?: boolean
  className?: string
  prefix?: string
  suffix?: string
  decimalScale?: number
}

export default function CurrencySwitch({
  tokenSymbol,
  tokenValue,
  usdDefault = false,
  className = '',
  prefix = '',
  suffix = '',
  decimalScale = 2,
}: CurrencySwitchProps) {
  const [isShowUsd, setShowUsd] = useState(usdDefault)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const valueToShow = isShowUsd
    ? tokenValue * (usdPrice?.[tokenSymbol] || 1)
    : tokenValue

  return (
    <div
      className={
        'cursor-pointer select-none transition-all active:scale-90' +
        ` ${className}`
      }
      onClick={() => setShowUsd(!isShowUsd)}
    >
      {prefix}
      {isShowUsd ? '$' : ''}
      {toHumanRead(valueToShow, decimalScale)}
      {isShowUsd ? '' : ' ' + tokenSymbol}
      {suffix}
    </div>
  )
}
