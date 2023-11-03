import { IContractInfo } from '@/constants/contracts'
import { Contract } from 'web3-eth-contract'

export interface IStakingInfo {
  label: string
  symbol: string
  deposited?: number
  earnings?: number
  threeYearValue?: number
  rate?: number
  data_key?: string
  APR?: number
  stakeContractInfo: IContractInfo
  tokenContractInfo: IContractInfo
  tokenStakeContractInfo: IContractInfo
  stakeContract?: Contract
  tokenContract?: Contract
  tokenStakeContract?: Contract
}
