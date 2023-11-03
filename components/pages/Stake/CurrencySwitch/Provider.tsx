import { updateAllUsdPrice } from '@/lib/redux/slices/usdPrice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

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
        dispatch(updateAllUsdPrice(usdPrice))
      } catch (error) {
        console.log('CurrencySwitchInit.handleGetUsdPrice', error)
      }
    }
    handleGetUsdPrice()
    setInterval(handleGetUsdPrice, 3 * 60 * 1000)
  }, [])

  return children
}
