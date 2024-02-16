import { BigNumber, BigNumberish, ethers } from 'ethers'
import { BASIS_POINTS_DIVISOR, PRECISION, USD_DECIMALS } from './legacy'

export function bigNumberify(n?: BigNumberish) {
  try {
    return BigNumber.from(n);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("bigNumberify error", e);
    return undefined;
  }
}

export function applyFactor(value: BigNumber, factor: BigNumber) {
  return value.mul(factor).div(PRECISION)
}

export function expandDecimals(n: BigNumberish, decimals: number): BigNumber {
  // @ts-ignore
  return bigNumberify(n).mul(bigNumberify(10).pow(decimals))
}
