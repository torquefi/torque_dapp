import {
  aaveUiPoolDataProviderCI,
  aaveWbtcRefinanceUsdcCI,
  radiantWbtcRefinanceUsdcCI,
  radiantWethRefinanceUsdcCI,
  radianUiPoolDataProviderCI,
  tokenRwbtcCI,
  tokenRwethCI,
  tokenUsdcCI,
  tokenUsdceCI,
  tokenWbtcCI,
  tokenWethCI,
} from './contract'
import { Collateral, IMarketInfo, Market } from './types'

export const radianProviderAddress =
  '0x091d52CacE1edc5527C99cDCFA6937C1635330E4'
export const aaveProviderAddress = '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb'

export const marketOptions: IMarketInfo[] = [
  {
    label: Market.RadiantUSDC,
    isEnable: true,
    tokenCI: tokenUsdcCI,
    poolDataProviderCI: radianUiPoolDataProviderCI,
    providerAddress: radianProviderAddress,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: radiantWbtcRefinanceUsdcCI,
        tokenMarketCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenMarketCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  {
    label: Market.RadiantUSDCe,
    isEnable: true,
    tokenCI: tokenUsdceCI,
    poolDataProviderCI: radianUiPoolDataProviderCI,
    providerAddress: radianProviderAddress,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: radiantWbtcRefinanceUsdcCI,
        tokenMarketCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenMarketCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  {
    label: Market.AaveV3USDC,
    isEnable: false,
    tokenCI: tokenUsdcCI,
    poolDataProviderCI: aaveUiPoolDataProviderCI,
    providerAddress: aaveProviderAddress,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: aaveWbtcRefinanceUsdcCI,
        tokenMarketCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenMarketCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  {
    label: Market.AaveV3USDCe,
    isEnable: false,
    tokenCI: tokenUsdceCI,
    poolDataProviderCI: aaveUiPoolDataProviderCI,
    providerAddress: aaveProviderAddress,
    collaterals: [
      {
        label: Collateral.WBTC,
        torqRefinanceCI: aaveWbtcRefinanceUsdcCI,
        tokenMarketCI: tokenRwbtcCI,
        tokenCI: tokenWbtcCI,
      },
      {
        label: Collateral.WETH,
        torqRefinanceCI: radiantWethRefinanceUsdcCI,
        tokenMarketCI: tokenRwethCI,
        tokenCI: tokenWethCI,
      },
    ],
  },
  // {
  //   label: Market.DolomiteUSDC,
  //   isEnable: false,
  // },
  // {
  //   label: Market.DolomiteUSDCe,
  //   isEnable: false,
  // },
  // {
  //   label: Market.LodestarUSDC,
  //   isEnable: false,
  // },
  // {
  //   label: Market.LodestarUSDCe,
  //   isEnable: false,
  // },
  // {
  //   label: Market.SiloUSDCe,
  //   isEnable: false,
  // },
]
