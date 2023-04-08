import { IContractInfo } from '@/constants/contracts'

export interface IStakingInfo {
  label: string
  symbol: string
  deposited?: number
  earnings?: number
  threeYearValue?: number
  rate?: number
  APY?: number
  stakeContract: IContractInfo
  tokenContract: IContractInfo
}
