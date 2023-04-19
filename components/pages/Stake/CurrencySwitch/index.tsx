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
  tokenPrice?: number | string
}

export default function CurrencySwitch({
  tokenSymbol,
  tokenValue,
  usdDefault = false,
  className = '',
  decimalScale = 0,
  tokenPrice = 1,
  render,
}: CurrencySwitchProps) {
  const [isShowUsd, setShowUsd] = useState(usdDefault)

  const valueToShow = isShowUsd ? tokenValue * Number(tokenPrice) : tokenValue

  const strToShow =
    (isShowUsd ? '$' : '') +
    // toMetricUnits(valueToShow, decimalScale) +
    Intl.NumberFormat(undefined, {
      maximumFractionDigits: decimalScale,
      minimumFractionDigits: decimalScale,
    }).format(+valueToShow) +
    (isShowUsd ? '' : ' ' + tokenSymbol)

  return (
    <div
      className={
        'cursor-pointer select-none text-center leading-none transition-all active:scale-90' +
        ` ${className}`
      }
      onClick={() => setShowUsd(!isShowUsd)}
    >
      {render ? render(strToShow) : strToShow}
    </div>
  )
}
