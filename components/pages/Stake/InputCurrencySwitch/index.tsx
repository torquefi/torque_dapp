import NumberFormat from '@/components/common/NumberFormat'
import { useEffect, useState } from 'react'

interface InputCurrencySwitchProps {
  tokenSymbol: string
  tokenValue?: number
  tokenValueChange?: number
  usdDefault?: boolean
  className?: string
  decimalScale?: number
  subtitle?: string
  onChange?: (num: number) => any
  render?: (str: string) => any
  onSetShowUsd?: any
  tokenPrice?: number
}

export default function InputCurrencySwitch({
  tokenSymbol,
  tokenValue,
  tokenValueChange,
  usdDefault = false,
  className = '',
  decimalScale = 3,
  subtitle,
  onChange,
  render,
  onSetShowUsd,
  tokenPrice = 0.005,
}: InputCurrencySwitchProps) {
  const [isShowUsd, setShowUsd] = useState(usdDefault)
  const [inputAmount, setInputAmount] = useState(0)

  console.log(inputAmount)

  useEffect(() => {
    if (onChange) {
      const amount = +inputAmount || 0
      if (isShowUsd) {
        onChange(!tokenPrice ? 0 : amount / tokenPrice)
      } else {
        onChange(amount)
      }
    }
  }, [inputAmount, isShowUsd])

  useEffect(() => {
    if (isShowUsd) {
      setInputAmount(tokenValueChange * tokenPrice)
    } else {
      setInputAmount(tokenValueChange)
    }
  }, [tokenValueChange, isShowUsd])

  useEffect(() => {
    const amount = +inputAmount || 0
    if (isShowUsd) {
      setInputAmount(amount * tokenPrice)
    } else {
      setInputAmount(!tokenPrice ? 0 : amount / tokenPrice)
    }
  }, [isShowUsd])

  return (
    <div
      className={
        'cursor-pointer select-none text-center leading-none text-[#000] transition-all active:scale-90 dark:text-white' +
        ` ${className}`
      }
      onClick={() => {
        setShowUsd(!isShowUsd)
        onSetShowUsd && onSetShowUsd((isShowUsd: boolean) => !isShowUsd)
      }}
    >
      <NumberFormat
        suffix={!isShowUsd ? ' ' + tokenSymbol : ''}
        prefix={isShowUsd ? '$' : ''}
        className={`max-w-full bg-transparent pb-[2px] text-center text-[32px] font-bold text-[#000] placeholder-[#464646] dark:text-[#ffff] dark:placeholder-[#fff]`}
        value={inputAmount}
        onChange={(event: any, value: any) => {
          setInputAmount(value)
        }}
        decimalScale={decimalScale}
        thousandSeparator
        placeholder={
          (isShowUsd ? '$' : '') +
          '0.00 ' +
          (isShowUsd ? '' : ' ' + tokenSymbol)
        }
        inputProps={{
          onClick: (e: any) => e?.stopPropagation(),
        }}
      />
      {subtitle && (
        <div className="font-mona pb-2 text-[16px] text-[#959595]">
          {subtitle}
        </div>
      )}
    </div>
  )
}
