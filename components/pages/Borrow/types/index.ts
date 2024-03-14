import { IContractInfo } from '@/constants/contracts'
import { Contract } from 'web3-eth-contract'

export interface IBorrowInfo {
  depositTokenIcon: string
  depositTokenSymbol: string
  depositTokenDecimal: number
  borrowTokenSymbol: string
  borrowTokenDecimal: number
  liquidity: number
  loanToValue: number
  getTORQ: number
  borrowRate: number
  borrowContractInfo?: IContractInfo
  tokenContractInfo?: IContractInfo
  borrowContract?: Contract
  tokenContract?: Contract
  tokenBorrowContractInfo?: IContractInfo
  name?: string
  routed?: string
  bonus?: number
}

export interface IBorrowInfoManage {
  depositTokenSymbol: string
  depositTokenDecimal: number
  borrowTokenSymbol: string
  borrowTokenDecimal: number
  label: string
  labelKey: string
  borrowRate: number
  collateral: number
  supplied: number
  borrowed: number
  ltv: number
  apy: number
  borrowContractInfo?: IContractInfo
  tokenContractInfo?: IContractInfo
  borrowContract?: Contract
  tokenContract?: Contract
  depositContractInfo?: IContractInfo
  borrowMax?: number
  bonus?: number
}
