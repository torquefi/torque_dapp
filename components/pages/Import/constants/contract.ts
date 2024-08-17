import { IContractInfo } from '@/constants/contracts'
import radianUiPoolDataProvider from './abi/radianUiPoolDataProvider.json'
import radiantWbtcRefinanceUsdc from './abi/radianWbtcRefinanceUsdc.json'
import radianWethRefinanceUsdc from './abi/radianWethRefinanceUsdc.json'
import tokenBtc from './abi/tokenBtc.json'
import tokenEth from './abi/tokenEth.json'
import tokenUsdc from './abi/tokenUsdc.json'
import tokenUsdce from './abi/tokenUsdce.json'

export const radiantWbtcRefinanceUsdcCI: IContractInfo = {
  address: '0x6b5c6C6a5223e1Ce30d24dedE62848bAd0845Fd2',
  abi: JSON.stringify(radiantWbtcRefinanceUsdc),
}

export const radiantWethRefinanceUsdcCI: IContractInfo = {
  address: '0xB4C189f3697F21703AbbB6550e97D8dDF4c3DF3B',
  abi: JSON.stringify(radianWethRefinanceUsdc),
}

export const radianUiPoolDataProviderCI: IContractInfo = {
  address: '0xc8e3bedf35f23037a1067f6ed72625caf72fa5d8',
  abi: JSON.stringify(radianUiPoolDataProvider),
}

export const tokenWbtcCI: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(tokenBtc),
}

export const tokenWethCI: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(tokenEth),
}

export const tokenUsdcCI: IContractInfo = {
  address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  abi: JSON.stringify(tokenUsdc),
}

export const tokenUsdceCI: IContractInfo = {
  address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  abi: JSON.stringify(tokenUsdce),
}
