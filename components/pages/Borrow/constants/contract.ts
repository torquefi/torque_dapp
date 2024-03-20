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
  address: '0xfdf7b4486f5de843838EcFd254711E06aF1f0641',
  abi: JSON.stringify(engineTusd),
}

// ======================================================================

export const borrowBtcContract: IContractInfo = {
  address: '0x9eD7f8115B3fA401cd7DdE5E59a8056a3Ec8cEB3',
  abi: JSON.stringify(borrowBtc),
}

export const borrowEthContract: IContractInfo = {
  address: '0x3B7cEF8320F0F3aF601eD33D0cC39a68b2fB37cA',
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
