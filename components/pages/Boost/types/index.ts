import { IContractInfo } from '@/constants/contracts'
import { Contract } from 'web3-eth-contract'

export interface IBoostInfo {
  tokenSymbol: string
  tokenDecimals: number
  defaultLabel: string
  labelKey: string
  deposited: number
  earnings: number
  APR: number
  tokenContractInfo: IContractInfo
  boostContractInfo: IContractInfo
  tokenContract?: Contract
  boostContract?: Contract
}
