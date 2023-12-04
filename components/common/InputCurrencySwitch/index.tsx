import NumberFormat from '@/components/common/NumberFormat'
import { AppStore } from '@/types/store'
import axios from 'axios'
import { useEffect, useState } from 'react'
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
  onSetShowUsd?: any
}

export const getPriceToken = async (symbol: string) => {
  let data = await axios.get(
    `https://api.binance.us/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`
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
  onSetShowUsd,
}: InputCurrencySwitchProps) {
  const [isShowUsd, setShowUsd] = useState(usdDefault)
  const [inputAmount, setInputAmount] = useState(0)
  const [tokenPrice, setTokenPrice] = useState(0)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
  const [price, setPrice] = useState<any>({
    eth: 1800,
    btc: 28000,
    usd: 1,
  })

  const getPrice = async () => {
    let price: any = {
      aeth: (await getPriceToken('ETH')) || 1800,
      wbtc: (await getPriceToken('BTC')) || 28000,
      usd: (await getPriceToken('USDC')) || 1,
    }
    setPrice(price)
    setTokenPrice(
      price[tokenSymbol.toLocaleLowerCase()] ||
        usdPrice[tokenSymbol.toLocaleLowerCase()] ||
        0
    )
  }

  // const valueToShow = isShowUsd
  //   ? tokenValue * (usdPrice?.[tokenSymbol] || 1)
  //   : tokenValue

  // const strToShow =
  //   (isShowUsd ? '$' : '') +
  //   toMetricUnits(valueToShow, decimalScale) +
  //   (isShowUsd ? '' : ' ' + tokenSymbol)

  useEffect(() => {
    if (onChange)
      if (isShowUsd) {
        onChange(!!tokenPrice ? inputAmount / tokenPrice : 0)
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
    getPrice()
  }, [])

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
        value={inputAmount || null}
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
