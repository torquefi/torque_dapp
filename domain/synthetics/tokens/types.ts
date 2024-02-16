import { BigNumber } from 'ethers'

export type Token = {
  name: string
  symbol: string
  baseSymbol?: string
  decimals: number
  address: string
  priceDecimals?: number
  wrappedAddress?: string
  coingeckoUrl?: string
  imageUrl?: string

  isUsdg?: boolean
  isNative?: boolean
  isWrapped?: boolean
  isShortable?: boolean
  isStable?: boolean
  isSynthetic?: boolean
  isTempHidden?: boolean
}

export type TokenPrices = {
  minPrice: BigNumber
  maxPrice: BigNumber
}

export type TokenData = Token & {
  prices: TokenPrices
  balance?: BigNumber
  totalSupply?: BigNumber
}

export type TokensRatio = {
  ratio: BigNumber
  largestToken: Token
  smallestToken: Token
}

export type TokenBalancesData = {
  [tokenAddress: string]: BigNumber
}

export type TokenPricesData = {
  [address: string]: TokenPrices
}

export type TokensAllowanceData = {
  [tokenAddress: string]: BigNumber
}

export type TokensData = {
  [address: string]: TokenData
}
