import { JSBI } from '@uniswap/sdk'
import { ethers } from 'ethers'
import ERC20 from './ERC20.json'
import IUniswapV3NFTmanagerABI from './UniV3NFT.json'
import IUniswapV3FactoryABI from './V3factory.json'
import IUniswapV3PoolABI from './V3PairAbi.json'

const provider = new ethers.providers.JsonRpcProvider(
  'https://arb1.arbitrum.io/rpc'
)

// V3 standard addresses (different for celo)
const factory = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const NFTmanager = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

async function getData(tokenID: any) {
  var FactoryContract = new ethers.Contract(
    factory,
    IUniswapV3FactoryABI,
    provider
  )

  var NFTContract = new ethers.Contract(
    NFTmanager,
    IUniswapV3NFTmanagerABI,
    provider
  )
  var position = await NFTContract.positions(tokenID)

  var token0contract = new ethers.Contract(position.token0, ERC20, provider)
  var token1contract = new ethers.Contract(position.token1, ERC20, provider)
  var Decimal0 = await token0contract.decimals()
  var Decimal1 = await token1contract.decimals()

  var token0sym = await token0contract.symbol()
  var token1sym = await token1contract.symbol()

  var V3pool = await FactoryContract.getPool(
    position.token0,
    position.token1,
    position.fee
  )
  var poolContract = new ethers.Contract(V3pool, IUniswapV3PoolABI, provider)

  var slot0 = await poolContract.slot0()
  var tickLow = await poolContract.ticks(position.tickLower.toString())
  var tickHi = await poolContract.ticks(position.tickUpper.toString())

  var feeGrowthGlobal0 = await poolContract.feeGrowthGlobal0X128()
  var feeGrowthGlobal1 = await poolContract.feeGrowthGlobal1X128()

  var pairName = token0sym + '/' + token1sym

  var PoolInfo = {
    Pair: pairName,
    Decimal0: Decimal0,
    Decimal1: Decimal1,
    tickCurrent: slot0.tick,
    tickLow: position.tickLower,
    tickHigh: position.tickUpper,
    liquidity: position.liquidity.toString(),
    feeGrowth0Low: tickLow.feeGrowthOutside0X128.toString(),
    feeGrowth0Hi: tickHi.feeGrowthOutside0X128.toString(),
    feeGrowth1Low: tickLow.feeGrowthOutside1X128.toString(),
    feeGrowth1Hi: tickHi.feeGrowthOutside1X128.toString(),
    feeGrowthInside0LastX128: position.feeGrowthInside0LastX128.toString(),
    feeGrowthInside1LastX128: position.feeGrowthInside1LastX128.toString(),
    feeGrowthGlobal0X128: feeGrowthGlobal0.toString(),
    feeGrowthGlobal1X128: feeGrowthGlobal1.toString(),
  }

  return PoolInfo
}

const ZERO: any = JSBI.BigInt(0)
const Q128: any = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128))
const Q256: any = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(256))

function toBigNumber(numstr: any) {
  let bi = numstr
  if (typeof numstr !== 'bigint') {
    bi = JSBI.BigInt(numstr)
  }
  return bi
}

function subIn256(x: any, y: any): any {
  const difference = JSBI.subtract(x, y)

  if (JSBI.lessThan(difference, ZERO)) {
    return JSBI.add(Q256, difference)
  } else {
    return difference
  }
}

async function getFees(
  feeGrowthGlobal0: any,
  feeGrowthGlobal1: any,
  feeGrowth0Low: any,
  feeGrowth0Hi: any,
  feeGrowthInside0: any,
  feeGrowth1Low: any,
  feeGrowth1Hi: any,
  feeGrowthInside1: any,
  liquidity: any,
  decimals0: any,
  decimals1: any,
  tickLower: any,
  tickUpper: any,
  tickCurrent: any
) {
  let feeGrowthGlobal_0 = toBigNumber(feeGrowthGlobal0)
  let feeGrowthGlobal_1 = toBigNumber(feeGrowthGlobal1)

  let tickLowerFeeGrowthOutside_0 = toBigNumber(feeGrowth0Low)
  let tickLowerFeeGrowthOutside_1 = toBigNumber(feeGrowth1Low)

  let tickUpperFeeGrowthOutside_0 = toBigNumber(feeGrowth0Hi)
  let tickUpperFeeGrowthOutside_1 = toBigNumber(feeGrowth1Hi)

  let tickLowerFeeGrowthBelow_0 = ZERO
  let tickLowerFeeGrowthBelow_1 = ZERO
  let tickUpperFeeGrowthAbove_0 = ZERO
  let tickUpperFeeGrowthAbove_1 = ZERO

  if (tickCurrent >= tickUpper) {
    tickUpperFeeGrowthAbove_0 = subIn256(
      feeGrowthGlobal_0,
      tickUpperFeeGrowthOutside_0
    )
    tickUpperFeeGrowthAbove_1 = subIn256(
      feeGrowthGlobal_1,
      tickUpperFeeGrowthOutside_1
    )
  } else {
    tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0
    tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1
  }

  if (tickCurrent >= tickLower) {
    tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0
    tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1
  } else {
    tickLowerFeeGrowthBelow_0 = subIn256(
      feeGrowthGlobal_0,
      tickLowerFeeGrowthOutside_0
    )
    tickLowerFeeGrowthBelow_1 = subIn256(
      feeGrowthGlobal_1,
      tickLowerFeeGrowthOutside_1
    )
  }

  let fr_t1_0: any = subIn256(
    subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthBelow_0),
    tickUpperFeeGrowthAbove_0
  )
  let fr_t1_1: any = subIn256(
    subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthBelow_1),
    tickUpperFeeGrowthAbove_1
  )

  let feeGrowthInsideLast_0: any = toBigNumber(feeGrowthInside0)
  let feeGrowthInsideLast_1: any = toBigNumber(feeGrowthInside1)

  let uncollectedFees_0 =
    (liquidity * subIn256(fr_t1_0, feeGrowthInsideLast_0)) / Q128
  let uncollectedFees_1 =
    (liquidity * subIn256(fr_t1_1, feeGrowthInsideLast_1)) / Q128
  console.log('liquidity :>> ', liquidity)
  console.log(
    'Amount fees token 0 in lowest decimal: ' + Math.floor(uncollectedFees_0)
  )
  console.log(
    'Amount fees token 1 in lowest decimal: ' + Math.floor(uncollectedFees_1)
  )

  let uncollectedFeesAdjusted_0 = (
    uncollectedFees_0 / toBigNumber(10 ** decimals0)
  ).toFixed(decimals0)
  let uncollectedFeesAdjusted_1 = (
    uncollectedFees_1 / toBigNumber(10 ** decimals1)
  ).toFixed(decimals1)
  console.log('Amount fees token 0 Human format: ' + uncollectedFeesAdjusted_0)
  console.log('Amount fees token 1 Human format: ' + uncollectedFeesAdjusted_1)
}

export async function Start(positionID: any) {
  var PoolInfo = await getData(positionID)

  console.log(PoolInfo)

  var Fees = await getFees(
    PoolInfo.feeGrowthGlobal0X128,
    PoolInfo.feeGrowthGlobal1X128,
    PoolInfo.feeGrowth0Low,
    PoolInfo.feeGrowth0Hi,
    PoolInfo.feeGrowthInside0LastX128,
    PoolInfo.feeGrowth1Low,
    PoolInfo.feeGrowth1Hi,
    PoolInfo.feeGrowthInside1LastX128,
    PoolInfo.liquidity,
    PoolInfo.Decimal0,
    PoolInfo.Decimal1,
    PoolInfo.tickLow,
    PoolInfo.tickHigh,
    PoolInfo.tickCurrent
  )
  console.log('Fees :>> ', Fees)
}

// Start(5)
