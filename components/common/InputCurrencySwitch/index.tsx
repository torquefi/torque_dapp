import NumberFormat from '@/components/common/NumberFormat'
import { floorFraction } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface InputCurrencySwitchProps {
  displayType?: 'text' | 'input'
  tokenSymbol: string
  tokenValue?: number
  tokenValueChange?: number
  usdDefault?: boolean
  className?: string
  decimalScale?: number
  subtitle?: string
  onChange?: (num: number, rawValue: number) => any
  render?: (str: string) => any
  onSetShowUsd?: any
}

export const getPriceToken = async (symbol: string) => {
  try {
    const pairSymbol = symbol.toUpperCase() === 'USDT' ? 'USDCUSDT' : `${symbol.toUpperCase()}USDT`;
    const data = await axios.get(`https://api.binance.us/api/v3/ticker/price?symbol=${pairSymbol}`);
    return Number(data?.data?.price) || 0;
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return 0;
  }
}

export default function InputCurrencySwitch({
  displayType = 'input',
  tokenSymbol,
  tokenValueChange,
  usdDefault = false,
  className = '',
  decimalScale = 2,
  subtitle,
  onChange,
  onSetShowUsd,
}: InputCurrencySwitchProps) {
  const [isShowUsd, setShowUsd] = useState(usdDefault)
  const [inputAmount, setInputAmount] = useState(0)
  const [isInputMade, setIsInputMade] = useState(false)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const tokenPrice = usdPrice[tokenSymbol.toLocaleLowerCase()] || 0

  useEffect(() => {
    if (onChange)
      if (isShowUsd) {
        const inputAmountTransformed = !!tokenPrice
          ? inputAmount / tokenPrice
          : 0
        onChange(inputAmountTransformed, inputAmount)
      } else {
        onChange(inputAmount, inputAmount)
      }
  }, [inputAmount])

  useEffect(() => {
    if (isShowUsd) {
      setInputAmount(tokenValueChange * tokenPrice)
    } else {
      setInputAmount(tokenValueChange)
    }
  }, [tokenValueChange])

  useEffect(() => {
    if (isShowUsd) setInputAmount(inputAmount * tokenPrice)
    else setInputAmount(inputAmount / tokenPrice)
  }, [isShowUsd])

  return (
    <div
      className={
        'cursor-pointer select-none text-center leading-none text-[#030303] transition-all active:scale-90 dark:text-white' +
        ` ${className}`
      }
      onClick={() => {
        setShowUsd(!isShowUsd)
        onSetShowUsd && onSetShowUsd((isShowUsd: boolean) => !isShowUsd)
      }}
    >
      <NumberFormat
        displayType={displayType}
        suffix={!isShowUsd ? ' ' + tokenSymbol : ''}
        prefix={isShowUsd ? '$' : ''}
        className={`block max-w-full whitespace-nowrap bg-transparent pb-[3px] text-center text-[26px] leading-tight text-[#030303] placeholder-[#030303] dark:text-[#ffff] dark:placeholder-[#fff] md:text-[32px] transition-opacity duration-100 ${
          isInputMade || inputAmount !== 0 ? 'opacity-100' : 'opacity-60'
        }`}
        value={
          +inputAmount
            ? floorFraction(inputAmount, isShowUsd ? 2 : 5)
            : displayType === 'input'
              ? null
              : '0.00'
        }
        onChange={(event: any, value: any) => {
          setInputAmount(value)
          setIsInputMade(true)
        }}
        decimalScale={isShowUsd ? 2 : 5}
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
        <div className="font-rogan-regular pb-2 text-[16px] text-[#959595]">
          {subtitle}
        </div>
      )}
    </div>
  )
}
