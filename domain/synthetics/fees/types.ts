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

export type ExecutionFee = {
  feeUsd: BigNumber
  feeTokenAmount: BigNumber
  feeToken: Token
  warning?: string
}

export type FeeItem = {
  deltaUsd: BigNumber
  bps: BigNumber
}

export type SwapFeeItem = FeeItem & {
  marketAddress: string
  tokenInAddress: string
  tokenOutAddress: string
}

export type GasLimitsConfig = {
  depositSingleToken: BigNumber
  depositMultiToken: BigNumber
  withdrawalMultiToken: BigNumber
  singleSwap: BigNumber
  swapOrder: BigNumber
  increaseOrder: BigNumber
  decreaseOrder: BigNumber
  estimatedFeeBaseGasLimit: BigNumber
  estimatedFeeMultiplierFactor: BigNumber
}
