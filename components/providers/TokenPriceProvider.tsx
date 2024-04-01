import { torqContract } from '@/constants/contracts'
import { pairContract } from '@/lib/hooks/usePriceToken'
import { updateAllUsdPrice } from '@/lib/redux/slices/usdPrice'
import axios from 'axios'
import { useEffect, useState } from 'react'
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

export function TokenPriceProvider({ children }: any) {
  const dispatch = useDispatch()


  useEffect(() => {
    const handleGetUsdPrice = async () => {
      let usdPrice: any = {}

      try {
        const response = await axios.get(
          `https://api.dexscreener.com/latest/dex/tokens/${torqContract?.address}`
        )
        const pairs = response?.data?.pairs || []
        const currentPair = pairs.find(
          (pair: any) =>
            pair.pairAddress?.toLowerCase() === pairContract?.toLowerCase()
        )
        usdPrice.torq = currentPair?.priceUsd || 0;
        usdPrice.TORQ = currentPair?.priceUsd || 0;
      } catch (error) {
        console.error('LiquidityPool.getLiquidityPoolInfo.getPairData', error)
      }

      try {
        // let url =
        //   'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'
        // const response = await fetch(url)
        // const data = await response.json()
        // usdPrice = data?.reduce((acc: any, cur: any) => {
        //   if (!acc[cur?.symbol]) {
        //     acc[cur?.symbol] = cur?.current_price
        //     acc[cur?.symbol?.toUpperCase()] = cur?.current_price
        //   }
        //   return acc
        // }, {})



        const ethPrice = await getPriceToken('ETH')
        const btcPrice = await getPriceToken('BTC')
        const tusdPrice = await getPriceToken('USDC')

        usdPrice.eth = ethPrice || usdPrice.eth || 1800
        usdPrice.ETH = ethPrice || usdPrice.ETH || 1800
        usdPrice.btc = btcPrice || usdPrice.btc || 28000
        usdPrice.BTC = btcPrice || usdPrice.BTC || 28000
        usdPrice.tusd = tusdPrice || usdPrice.TUSD || 1
        usdPrice.TUSD = tusdPrice || usdPrice.TUSD || 1
        usdPrice.usdc = tusdPrice || usdPrice.TUSD || 1
        usdPrice.USDC = tusdPrice || usdPrice.TUSD || 1
        usdPrice.wbtc = btcPrice || usdPrice.btc || 28000
        usdPrice.WBTC = btcPrice || usdPrice.BTC || 28000
        usdPrice.weth = ethPrice || usdPrice.eth || 1800
        usdPrice.WETH = ethPrice || usdPrice.eth || 1800
        console.log('usdPrice', usdPrice)
        dispatch(updateAllUsdPrice(usdPrice))
      } catch (error) {
        console.log('TokenPriceProvider.handleGetUsdPrice', error)
      }
    }
    handleGetUsdPrice()
    const interval = setInterval(() => {
      handleGetUsdPrice()
    }, 10 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div>{children}</div>
}
