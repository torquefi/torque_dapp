import NumberFormat from '@/components/NumberFormat'
import { floorFraction, toHumanRead } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface InputCurrencySwitchProps {
  tokenSymbol: string
  tokenValue: number
  usdDefault?: boolean
  className?: string
  decimalScale?: number
  subtitle?: string
  onChange?: (num: number) => any
  render?: (str: string) => any
}

export default function InputCurrencySwitch({
  tokenSymbol,
  tokenValue,
  usdDefault = false,
  className = '',
  decimalScale = 2,
  subtitle,
  onChange,
  render,
}: InputCurrencySwitchProps) {
  const [isShowUsd, setShowUsd] = useState(usdDefault)
  const [inputAmount, setInputAmount] = useState(0)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
  const price: any = {
    eth: 1780,
    btc: 28000,
    usdc: 1,
  }

  const valueToShow = isShowUsd
    ? tokenValue * (usdPrice?.[tokenSymbol] || 1)
    : tokenValue

  const strToShow =
    (isShowUsd ? '$' : '') +
    toHumanRead(valueToShow, decimalScale) +
    (isShowUsd ? '' : ' ' + tokenSymbol)

  useEffect(() => {
    if (onChange) onChange(inputAmount)
  }, [inputAmount])

  useEffect(() => {
    if (isShowUsd)
      setInputAmount(inputAmount * price[tokenSymbol.toLocaleLowerCase()])
    else setInputAmount(inputAmount / price[tokenSymbol.toLocaleLowerCase()])
  }, [isShowUsd])

  return (
    <div
      className={
        'cursor-pointer select-none text-center transition-all active:scale-90' +
        ` ${className}`
      }
      onClick={() => setShowUsd(!isShowUsd)}
    >
      <NumberFormat
        suffix={!isShowUsd && ' ' + tokenSymbol}
        prefix={isShowUsd && '$ '}
        className={`h-[24px] max-w-full bg-transparent pt-1 text-center text-[28px] font-bold text-white placeholder-gray-50`}
        value={floorFraction(inputAmount) + tokenSymbol || null}
        onChange={(event: any) => {
          setInputAmount(
            event.target.value
              ?.replaceAll(/($|,|\b)/g, '')
              .replace(tokenSymbol, '')
          )
        }}
        thousandSeparator
        placeholder={'0.00 ' + tokenSymbol}
      />
      {subtitle && (
        <div className="font-mona text-[16px] text-[#959595]">{subtitle}</div>
      )}
    </div>
  )
}
