import { toMetricUnits } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

interface CurrencySwitchProps {
  tokenSymbol: string
  tokenValue: number
  usdDefault?: boolean
  className?: string
  decimalScale?: number
  render?: (str: string) => any
}

export default function CurrencySwitch({
  tokenSymbol,
  tokenValue,
  usdDefault = false,
  className = '',
  decimalScale = 2,
  render,
}: CurrencySwitchProps) {
  const [isShowUsd, setShowUsd] = useState(usdDefault)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const valueToShow = isShowUsd
    ? tokenValue * (usdPrice?.[tokenSymbol] || 1)
    : tokenValue

  const strToShow =
    (isShowUsd ? '$' : '') +
    toMetricUnits(valueToShow, decimalScale) +
    (isShowUsd ? '' : ' ' + tokenSymbol)

  return (
    <div
      className={
        'cursor-pointer select-none text-center transition-all active:scale-90' +
        ` ${className}`
      }
      onClick={() => setShowUsd(!isShowUsd)}
    >
      {render ? render(strToShow) : strToShow}
    </div>
  )
}
