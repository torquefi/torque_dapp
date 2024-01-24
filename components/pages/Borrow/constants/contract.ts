import { IContractInfo } from '@/constants/contracts'
import borrowBtc from './abi/borrowBtc.json'
import borrowEth from './abi/borrowEth.json'
import compoundUsdc from './abi/compoundUsdc.json'
import engineTusd from './abi/engineTusd.json'
import tokenBtc from './abi/tokenBtc.json'
import tokenEth from './abi/tokenEth.json'
import tokenUsdc from './abi/tokenUsdc.json'
import tokenTusd from './abi/tokenTusd.json'

export const tokenTusdContract: IContractInfo = {
  address: '0xf7F6718Cf69967203740cCb431F6bDBff1E0FB68',
  abi: JSON.stringify(tokenTusd),
}

export const tokenUsdcContract: IContractInfo = {
  address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  abi: JSON.stringify(tokenUsdc),
}

export const compoundUsdcContract: IContractInfo = {
  address: '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf',
  abi: JSON.stringify(compoundUsdc),
}

export const engineTusdContract: IContractInfo = {
  address: '0x3c716812B02aC5Ea432b153B134770e7f78E6542',
  abi: JSON.stringify(engineTusd),
}

// ======================================================================

export const borrowBtcContract: IContractInfo = {
  address: '0x29f7c7f92F64ff3a5B3071c33Fb5033cdAAc9724',
  abi: JSON.stringify(borrowBtc),
}

export const borrowEthContract: IContractInfo = {
  address: '0x10a6437ebc823389c0210d878152c7df9663e886',
  abi: JSON.stringify(borrowEth),
}

export const tokenBtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(tokenBtc),
}

export const tokenEthContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(tokenEth),
}
