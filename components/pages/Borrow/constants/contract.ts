import { IContractInfo } from '@/constants/contracts'
import borrowBtc from './abi/borrowBtc.json'
import borrowEth from './abi/borrowEth.json'
import compoundUsdc from './abi/compoundUsdc.json'
import engineUsd from './abi/engineUsd.json'
import tokenBtc from './abi/tokenBtc.json'
import tokenEth from './abi/tokenEth.json'
import tokenUsdcArb from './abi/tokenUsdcArb.json'

export const tokenUsdcContractInfo: IContractInfo = {
  address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  abi: JSON.stringify(tokenUsdcArb),
}

export const compoundUsdcContractInfo: IContractInfo = {
  address: '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf',
  abi: JSON.stringify(compoundUsdc),
}

export const engineUsdContractInfo: IContractInfo = {
  address: '0x5c51Fb12f845569369A838e2c6868Cb06d8b35De',
  abi: JSON.stringify(engineUsd),
}

// ======================================================================

export const borrowBtcContractInfo: IContractInfo = {
  address: '0xC23E3B91859F3fe72CFE5d63Ad54d83fEAF7a706',
  abi: JSON.stringify(borrowBtc),
}

export const borrowEthContractInfo: IContractInfo = {
  address: '0x4C164283a3a357BBEF0BA95eeF9CC0ED7fECA035',
  abi: JSON.stringify(borrowEth),
}

export const tokenBtcContractInfo: IContractInfo = {
  address: '0xbda18Ffa03Aab42F7004735F486c65e38A726481',
  abi: JSON.stringify(tokenBtc),
}

export const tokenEthContractInfo: IContractInfo = {
  address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  abi: JSON.stringify(tokenEth),
}
