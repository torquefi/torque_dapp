import { IContractInfo } from '@/constants/contracts'
import borrowBtc from './abi/borrowBtc.json'
import borrowEth from './abi/borrowEth.json'
import compoundUsdc from './abi/compoundUsdc.json'
import engineTusd from './abi/engineTusd.json'
import tokenBtc from './abi/tokenBtc.json'
import tokenEth from './abi/tokenEth.json'
import tokenUsdc from './abi/tokenUsdc.json'
import tokenTusd from './abi/tokenTusd.json'
import simpleBorrowBtc from './abi/simpleBorrowBtc.json'
import simpleBorrowEth from './abi/simpleBorrowEth.json'
import userAddressBtc from './abi/userAddressBtc.json'
import userAddressEth from './abi/userAddressEth.json'

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

export const tokenBtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(tokenBtc),
}

export const tokenEthContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(tokenEth),
}

// ======================================================================

export const borrowBtcContract: IContractInfo = {
  address: '0xE307f7E20d86c26065466E1928362CB0f8Deb186',
  abi: JSON.stringify(borrowBtc),
}

export const borrowEthContract: IContractInfo = {
  address: '0x6421E770A7a23649feF3bB572EA3Df71aBce824A',
  abi: JSON.stringify(borrowEth),
}

export const simpleBorrowBtcContract: IContractInfo = {
  address: '0x0eD2CF32cBf676Ad8D1202937aEE40FB3397d7bd',
  abi: JSON.stringify(simpleBorrowBtc),
}

export const simpleBorrowEthContract: IContractInfo = {
  address: '0x8e9b8E64a448a09cB1476f835771E6A064e780b3',
  abi: JSON.stringify(simpleBorrowEth),
}

export const userBorrowAddressBtcContract: IContractInfo = {
  address: '0x23c41D470BB42bb33eb5CbE7Aa5b07920B4fCEC7',
  abi: JSON.stringify(userAddressBtc),
}

export const userBorrowAddressEthContract: IContractInfo = {
  address: '0x6e4182e2B8fC845220582172A5F40BE8cd50B116',
  abi: JSON.stringify(userAddressEth),
}

export const borrowOldBtcContract: IContractInfo = {
  address: '0x9eD7f8115B3fA401cd7DdE5E59a8056a3Ec8cEB3',
  abi: JSON.stringify(userAddressBtc),
}

export const borrowOldEthContract: IContractInfo = {
  address: '0x3B7cEF8320F0F3aF601eD33D0cC39a68b2fB37cA',
  abi: JSON.stringify(userAddressEth),
}
