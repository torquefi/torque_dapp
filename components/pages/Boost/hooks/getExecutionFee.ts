import { NATIVE_TOKEN_ADDRESS } from '@/configs/tokens'
import { getChainName, getHighExecutionFee } from '@/configs/chains'
import {
  convertToUsd,
  getTokenData,
  TokensData,
} from '@/domain/synthetics/tokens'
import { USD_DECIMALS } from '@/lib/legacy'
import { applyFactor, bigNumberify, expandDecimals } from '@/lib/numbers'
import { BigNumber } from 'ethers'
import { ExecutionFee, GasLimitsConfig } from '../types/fee'

export function getExecutionFee(
  chainId: number,
  gasLimits: GasLimitsConfig,
  tokensData: TokensData,
  estimatedGasLimit: BigNumber,
  gasPrice: BigNumber
): ExecutionFee | undefined {
  if (!gasLimits) {
    return undefined
  }

  const nativeToken = getTokenData(tokensData, NATIVE_TOKEN_ADDRESS)

  if (!nativeToken) return undefined

  const baseGasLimit = bigNumberify(gasLimits.estimatedFeeBaseGasLimit)
  const multiplierFactor = bigNumberify(gasLimits.estimatedFeeMultiplierFactor)
  const adjustedGasLimit = baseGasLimit.add(
    applyFactor(estimatedGasLimit, multiplierFactor)
  )

  const feeTokenAmount = adjustedGasLimit.mul(gasPrice)

  const feeUsd = convertToUsd(
    feeTokenAmount,
    nativeToken.decimals,
    nativeToken.prices.minPrice
  )!

  const isFeeHigh = feeUsd.gt(
    expandDecimals(getHighExecutionFee(chainId), USD_DECIMALS)
  )

  const warning = isFeeHigh
    ? `The network Fees are very high currently, which may be due to a temporary increase in transactions on the ${getChainName(
        chainId
      )} network.`
    : undefined

  return {
    feeUsd,
    feeTokenAmount,
    feeToken: nativeToken,
    warning,
  }
}

export function estimateExecuteDepositGasLimit(
  gasLimits: GasLimitsConfig,
  deposit: {
    longTokenSwapsCount?: number
    shortTokenSwapsCount?: number
    initialLongTokenAmount?: BigNumber
    initialShortTokenAmount?: BigNumber
    callbackGasLimit?: BigNumber
  }
) {
  if (!gasLimits) {
    return undefined
  }

  const gasPerSwap = bigNumberify(gasLimits.singleSwap)

  const swapsCount =
    (deposit.longTokenSwapsCount || 0) + (deposit.shortTokenSwapsCount || 0)

  const gasForSwaps = gasPerSwap.mul(swapsCount)
  const isMultiTokenDeposit =
    deposit.initialLongTokenAmount?.gt(0) &&
    deposit.initialShortTokenAmount?.gt(0)

  const depositGasLimit = isMultiTokenDeposit
    ? gasLimits.depositMultiToken
    : gasLimits.depositSingleToken

  return bigNumberify(depositGasLimit)
    .add(gasForSwaps)
    .add(deposit.callbackGasLimit || 0)
}

export function estimateExecuteWithdrawalGasLimit(
  gasLimits: GasLimitsConfig,
  withdrawal: { callbackGasLimit?: BigNumber }
) {
  if (!gasLimits) {
    return undefined
  }

  return bigNumberify(gasLimits.withdrawalMultiToken).add(
    withdrawal.callbackGasLimit || 0
  )
}

export function estimateExecuteIncreaseOrderGasLimit(
  gasLimits: GasLimitsConfig,
  order: { swapsCount?: number; callbackGasLimit?: BigNumber }
) {
  if (!gasLimits) {
    return undefined
  }

  return gasLimits.increaseOrder
    .add(gasLimits.singleSwap.mul(order.swapsCount || 0))
    .add(order.callbackGasLimit || 0)
}

export function estimateExecuteDecreaseOrderGasLimit(
  gasLimits: GasLimitsConfig,
  order: { swapsCount?: number; callbackGasLimit?: BigNumber }
) {
  if (!gasLimits) {
    return undefined
  }

  return gasLimits.decreaseOrder
    .add(gasLimits.singleSwap.mul(order.swapsCount || 0))
    .add(order.callbackGasLimit || 0)
}

export function estimateExecuteSwapOrderGasLimit(
  gasLimits: GasLimitsConfig,
  order: { swapsCount?: number; callbackGasLimit?: BigNumber }
) {
  if (!gasLimits) {
    return undefined
  }

  return gasLimits.swapOrder
    .add(gasLimits.singleSwap.mul(order.swapsCount || 0))
    .add(order.callbackGasLimit || 0)
}
