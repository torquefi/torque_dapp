import NumberFormat from '@/components/common/NumberFormat'
import { floorFraction, toMetricUnits } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

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
}

const getPriceToken = async (symbol: string) => {
  let data = await axios.get(
    `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`
  )
  return (await Number(data?.data?.price)) || 0
}

export default function InputCurrencySwitch({
  tokenSymbol,
  tokenValue,
  tokenValueChange,
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
  const [price, setPrice] = useState<any>({
    eth: 1800,
    btc: 28000,
    usdc: 1,
  })

  const tokenPrice =
    price[tokenSymbol.toLocaleLowerCase()] ||
    usdPrice[tokenSymbol.toLocaleLowerCase()] ||
    1

  const getPrice = async () => {
    setPrice({
      eth: (await getPriceToken('ETH')) || 1800,
      btc: (await getPriceToken('BTC')) || 28000,
      usdc: (await getPriceToken('USDC')) || 1,
    })
  }

  const valueToShow = isShowUsd
    ? tokenValue * (usdPrice?.[tokenSymbol] || 1)
    : tokenValue

  const strToShow =
    (isShowUsd ? '$' : '') +
    toMetricUnits(valueToShow, decimalScale) +
    (isShowUsd ? '' : ' ' + tokenSymbol)

  useEffect(() => {
    if (onChange)
      if (isShowUsd) {
        onChange(inputAmount / tokenPrice)
      } else {
        onChange(inputAmount)
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

  useEffect(() => {
    setInputAmount(tokenValue)
  }, [tokenValue])

  useEffect(() => {
    getPrice()
  }, [])

  return (
    <div
      className={
        'cursor-pointer select-none text-center leading-none transition-all active:scale-90' +
        ` ${className}`
      }
      onClick={() => setShowUsd(!isShowUsd)}
    >
      <NumberFormat
        suffix={!isShowUsd ? ' ' + tokenSymbol : ''}
        prefix={isShowUsd ? '$' : ''}
        className={`max-w-full bg-transparent pb-[2px] text-center text-[32px] font-bold text-white placeholder-gray-50`}
        value={floorFraction(inputAmount) || null}
        onChange={(event: any, value: any) => {
          setInputAmount(value)
        }}
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
        <div className="pb-2 font-mona text-[16px] text-[#959595]">
          {subtitle}
        </div>
      )}
    </div>
  )
}
