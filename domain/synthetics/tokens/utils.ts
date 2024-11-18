import { BigNumber } from 'ethers'
import {
  TokensAllowanceData,
  TokenData,
  TokenPrices,
  TokensData,
  TokensRatio,
} from './types'
import { expandDecimals } from '@/lib/numbers'
import { NATIVE_TOKEN_ADDRESS } from '@/configs/tokens'

export function getTokenData(
  tokensData?: TokensData,
  address?: string,
  convertTo?: 'wrapped' | 'native'
) {
  if (!address || !tokensData?.[address]) {
    return undefined
  }

  const token = tokensData[address]

  if (convertTo === 'wrapped' && token.isNative && token.wrappedAddress) {
    return tokensData[token.wrappedAddress]
  }

  if (convertTo === 'native' && token.isWrapped) {
    return tokensData[NATIVE_TOKEN_ADDRESS]
  }

  return token
}

export function convertToUsd(
  tokenAmount: BigNumber | undefined,
  tokenDecimals: number | undefined,
  price: BigNumber | undefined
) {
  if (!tokenAmount || typeof tokenDecimals !== 'number' || !price) {
    return undefined
  }

  return tokenAmount.mul(price).div(expandDecimals(1, tokenDecimals))
}

export function parseContractPrice(price: BigNumber, tokenDecimals: number) {
  return price.mul(expandDecimals(1, tokenDecimals))
}
