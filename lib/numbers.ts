import { BigNumber, BigNumberish, ethers } from 'ethers'
import { BASIS_POINTS_DIVISOR, PRECISION, USD_DECIMALS } from './legacy'

export function applyFactor(value: BigNumber, factor: BigNumber) {
  return value.mul(factor).div(PRECISION)
}

export function expandDecimals(n: BigNumberish, decimals: number): BigNumber {
  // @ts-ignore
  return bigNumberify(n).mul(bigNumberify(10).pow(decimals))
}
