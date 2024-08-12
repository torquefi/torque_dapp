import { IContractInfo } from '@/constants/contracts'
import borrowBtc from './abi/borrowBtc.json'
import borrowEth from './abi/borrowEth.json'
import compoundUsdc from './abi/compoundUsdc.json'
import engineTusd from './abi/engineTusd.json'
import tokenBtc from './abi/tokenBtc.json'
import tokenEth from './abi/tokenEth.json'
import tokenUsdc from './abi/tokenUsdc.json'
import tokenTusd from './abi/tokenTusd.json'
import tokenUsdt from './abi/tokenUsdt.json'
import simpleBorrowBtc from './abi/simpleBorrowBtc.json'
import simpleBorrowEth from './abi/simpleBorrowEth.json'
import simpleBtcBorrowUsdt from './abi/simpleBtcBorrowUsdt.json'
import simpleEthBorrowUsdt from './abi/simpleEthBorrowUsdt.json'
import userAddressBtc from './abi/userAddressBtc.json'
import userAddressEth from './abi/userAddressEth.json'
import btcBorrowUsdtAbi from './abi/btcBorrowUsdt.json'
import ethBorrowUsdtAbi from './abi/ethBorrowUsdt.json'

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

export const tokenUsdtContract: IContractInfo = {
  address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  abi: JSON.stringify(tokenUsdt),
}

// ======================================================================

export const btcBorrowUsdtContract: IContractInfo = {
  address: '0x08be670F8ef77Dce87EaA144C4365a32564BF4D8',
  abi: JSON.stringify(btcBorrowUsdtAbi),
}

export const ethBorrowUsdtContract: IContractInfo = {
  address: '0xF5B662dF870f058A7726879DCaB1B2bA8D8D6377',
  abi: JSON.stringify(ethBorrowUsdtAbi),
}

export const borrowBtcContract: IContractInfo = {
  address: '0xE307f7E20d86c26065466E1928362CB0f8Deb186',
  abi: JSON.stringify(borrowBtc),
}

export const borrowEthContract: IContractInfo = {
  address: '0x6421E770A7a23649feF3bB572EA3Df71aBce824A',
  abi: JSON.stringify(borrowEth),
}

export const simpleBorrowBtcContract: IContractInfo = {
  address: '0x0A37c0D9d2D0be52cEe2D0aF74B2E9CB209e9b9c',
  // address: '0x4aa1e8f878a4AB7A27F55A40b2af66925e6f3E5F',
  // address: '0x0eD2CF32cBf676Ad8D1202937aEE40FB3397d7bd',
  abi: JSON.stringify(simpleBorrowBtc),
}

export const simpleBorrowEthContract: IContractInfo = {
  address: '0x2b8653f900e8083e7F9c4c89D2752fC7584dba2a',
  // address: '0xDd0E807e17843C12387e99964E5Cf0C39B42f79a',
  // address: '0x8e9b8E64a448a09cB1476f835771E6A064e780b3',
  abi: JSON.stringify(simpleBorrowEth),
}

export const simpleBtcBorrowUsdtContract: IContractInfo = {
  address: '0x08be670F8ef77Dce87EaA144C4365a32564BF4D8',
  abi: JSON.stringify(simpleBtcBorrowUsdt),
}

export const simpleEthBorrowUsdtContract: IContractInfo = {
  address: '0xF5B662dF870f058A7726879DCaB1B2bA8D8D6377',
  abi: JSON.stringify(simpleEthBorrowUsdt),
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
