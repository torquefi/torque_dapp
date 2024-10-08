import { IContractInfo } from '@/constants/contracts'
import radianUiPoolDataProvider from './abi/radianUiPoolDataProvider.json'
import radianLendingPool from './abi/radianLendingPool.json'
import radiantWbtcRefinanceUsdc from './abi/radianWbtcRefinanceUsdc.json'
import radiantWethRefinanceUsdc from './abi/radianWethRefinanceUsdc.json'
import aaveUiPoolDataProvider from './abi/aaveUiPoolDataProvider.json'
import aaveLendingPool from './abi/aaveLendingPool.json'
import aaveWbtcRefinanceUsdc from './abi/aaveWbtcRefinanceUsdc.json'
import aaveWethRefinanceUsdc from './abi/aaveWethRefinanceUsdc.json'
import tokenRwbtc from './abi/tokenWbtc.json'
import tokenRweth from './abi/tokenWeth.json'
import tokenWbtc from './abi/tokenWbtc.json'
import tokenWeth from './abi/tokenWeth.json'
import tokenUsdc from './abi/tokenUsdc.json'
import tokenUsdce from './abi/tokenUsdce.json'

export const radiantWbtcRefinanceUsdcCI: IContractInfo = {
  address: '0x380206E0D634630d1F47eCdA0A01e4B95409D9f7',
  abi: JSON.stringify(radiantWbtcRefinanceUsdc),
}

export const radiantWethRefinanceUsdcCI: IContractInfo = {
  address: '0x5c4DC1c9fbC4DDBb29680e1B6aE80432a3942e9b',
  abi: JSON.stringify(radiantWethRefinanceUsdc),
}

export const radianUiPoolDataProviderCI: IContractInfo = {
  address: '0xc8e3bedf35f23037a1067f6ed72625caf72fa5d8',
  abi: JSON.stringify(radianUiPoolDataProvider),
}

export const radianLendingPoolCI: IContractInfo = {
  address: '0xF4B1486DD74D07706052A33d31d7c0AAFD0659E1',
  abi: JSON.stringify(radianLendingPool),
}

export const aaveWbtcRefinanceUsdcCI: IContractInfo = {
  address: '0xe76686E8723E1cf300A43616B5249C144f43d485',
  abi: JSON.stringify(aaveWbtcRefinanceUsdc),
}

export const aaveWethRefinanceUsdcCI: IContractInfo = {
  address: '0xeecbD33fA7b52834417fB73fF888cEC7C8B1f483',
  abi: JSON.stringify(aaveWethRefinanceUsdc),
}

export const aaveUiPoolDataProviderCI: IContractInfo = {
  address: '0x5d4D4007A4c6336550DdAa2a7c0d5e7972eebd16',
  abi: JSON.stringify(aaveUiPoolDataProvider),
}

export const aaveLendingPoolCI: IContractInfo = {
  address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
  abi: JSON.stringify(aaveLendingPool),
}

export const tokenRwbtcCI: IContractInfo = {
  name: 'RWBTC',
  address: '0x727354712bdfcd8596a3852fd2065b3c34f4f770',
  abi: JSON.stringify(tokenRwbtc),
}

export const tokenRwethCI: IContractInfo = {
  name: 'RWETH',
  address: '0x0df5dfd95966753f01cb80e76dc20ea958238c46',
  abi: JSON.stringify(tokenRweth),
}

export const tokenWbtcCI: IContractInfo = {
  name: 'WBTC',
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(tokenWbtc),
}

export const tokenWethCI: IContractInfo = {
  name: 'WETH',
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(tokenWeth),
}

export const tokenUsdcCI: IContractInfo = {
  name: 'USDC',
  address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  abi: JSON.stringify(tokenUsdc),
}

export const tokenUsdceCI: IContractInfo = {
  name: 'USDCe',
  address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  abi: JSON.stringify(tokenUsdce),
}
