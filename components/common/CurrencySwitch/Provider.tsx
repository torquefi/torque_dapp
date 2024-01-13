import { updateAllUsdPrice } from '@/lib/redux/slices/usdPrice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const getPriceToken = async (symbol: string) => {
  try {
    let data = await axios.get(
      `https://api.binance.us/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`
    )
    return (await Number(data?.data?.price)) || 0
  } catch (error) {
    return 0
  }
}

export default function CurrencySwitchInit({ children }: any) {
  const dispatch = useDispatch()

  useEffect(() => {
    const handleGetUsdPrice = async () => {
      try {
        let url =
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'
        const response = await fetch(url)
        const data = await response.json()
        const usdPrice = data?.reduce((acc: any, cur: any) => {
          if (!acc[cur?.symbol]) {
            acc[cur?.symbol] = cur?.current_price
            acc[cur?.symbol?.toUpperCase()] = cur?.current_price
          }
          return acc
        }, {})
        const ethPrice = await getPriceToken('ETH')
        const btcPrice = await getPriceToken('BTC')
        const tusdPrice = await getPriceToken('TUSD')

        usdPrice.eth = ethPrice || usdPrice.eth || 1800
        usdPrice.btc = btcPrice || usdPrice.btc || 28000
        usdPrice.TUSD = tusdPrice || usdPrice.TUSD || 1
        usdPrice.ETH = ethPrice || usdPrice.ETH || 1800
        usdPrice.BTC = btcPrice || usdPrice.BTC || 28000
        usdPrice.AETH = ethPrice || usdPrice.eth || 1800
        dispatch(updateAllUsdPrice(usdPrice))
      } catch (error) {
        console.log('CurrencySwitchInit.handleGetUsdPrice', error)
      }
    }
    handleGetUsdPrice()
    setInterval(handleGetUsdPrice, 3 * 60 * 1000)
  }, [])

  return <div>{children}</div>
}
