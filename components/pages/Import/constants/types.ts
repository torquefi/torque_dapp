import { IContractInfo } from "@/constants/contracts"

export enum Market {
  RadiantUSDC = 'Radiant USDC',
  RadiantUSDCe = 'Radiant USDC.e',
  AaveV3USDC = 'Aave V3 USDC',
  AaveV3USDCe = 'Aave V3 USDC.e',
  DolomiteUSDC = 'Dolomite USDC',
  DolomiteUSDCe = 'Dolomite USDC.e',
  LodestarUSDC = 'Lodestar USDC',
  LodestarUSDCe = 'Lodestar USDC.e',
  SiloUSDCe = 'Silo USDC.e',
}

export enum Collateral {
  WBTC = 'WBTC',
  WETH = 'WETH',
}

export interface ICollateralInfo {
  label: Collateral
  torqRefinanceCI: IContractInfo
  tokenCI: IContractInfo
  tokenRadianCI: IContractInfo
}

export interface IMarketInfo {
  label: Market
  isEnable: boolean
  tokenCI?: IContractInfo
  collaterals?: ICollateralInfo[]
}
