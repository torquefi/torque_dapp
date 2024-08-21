import {
  aaveWbtcRefinanceUsdcCI,
  radiantWbtcRefinanceUsdcCI,
  radiantWethRefinanceUsdcCI,
  tokenRwbtcCI,
  tokenRwethCI,
  tokenUsdcCI,
  tokenUsdceCI,
  tokenWbtcCI,
  tokenWethCI,
} from './contract'
import { Collateral, IMarketInfo, Market } from './types'

export const providerAddress = '0x091d52CacE1edc5527C99cDCFA6937C1635330E4'

export const marketOptions: IMarketInfo[] = [
  {
    label: Market.RadiantUSDC,
    isEnable: true,
    tokenCI: tokenUsdcCI,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: radiantWbtcRefinanceUsdcCI,
        tokenRadianCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenRadianCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  {
    label: Market.RadiantUSDCe,
    isEnable: true,
    tokenCI: tokenUsdceCI,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: radiantWbtcRefinanceUsdcCI,
        tokenRadianCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenRadianCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  {
    label: Market.AaveV3USDC,
    isEnable: false,
    tokenCI: tokenUsdcCI,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: aaveWbtcRefinanceUsdcCI,
        tokenRadianCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenRadianCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  {
    label: Market.AaveV3USDCe,
    isEnable: false,
    tokenCI: tokenUsdceCI,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: aaveWbtcRefinanceUsdcCI,
        tokenRadianCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenRadianCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  {
    label: Market.DolomiteUSDC,
    isEnable: false,
  },
  {
    label: Market.DolomiteUSDCe,
    isEnable: false,
  },
  {
    label: Market.LodestarUSDC,
    isEnable: false,
  },
  {
    label: Market.LodestarUSDCe,
    isEnable: false,
  },
  {
    label: Market.SiloUSDCe,
    isEnable: false,
  },
]
