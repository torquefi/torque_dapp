import {
  stakeLpContract,
  stakeTorqContract,
  tokenLpContract,
  tokenStakingTorqContract,
  tokenTorqContract,
} from '@/constants/contracts'
import { IStakingInfo } from './types'

export const STAKING_POOLS: IStakingInfo[] = [
  {
    label: 'TORQ',
    symbol: 'TORQ',
    threeYearValue: 0,
    rate: 1.72,
    APR: 24,
    tokenContractInfo: tokenTorqContract,
    stakeContractInfo: stakeTorqContract,
    tokenStakeContractInfo: tokenStakingTorqContract,
  },
  {
    label: 'LP',
    symbol: 'LP',
    threeYearValue: 0,
    rate: 2.68,
    APR: 56,
    tokenContractInfo: tokenLpContract,
    stakeContractInfo: stakeLpContract,
    tokenStakeContractInfo: tokenStakingTorqContract,
  },
]

export const STAKING_DATA: IStakingInfo[] = [
  {
    label: 'TORQ',
    symbol: 'TORQ',
    deposited: 0,
    earnings: 0,
    APR: 24,
    data_key: 'name_staking_1',
    tokenContractInfo: tokenTorqContract,
    stakeContractInfo: stakeTorqContract,
    tokenStakeContractInfo: tokenStakingTorqContract,
  },
  {
    label: 'LP',
    symbol: 'LP',
    deposited: 0,
    earnings: 0,
    APR: 56,
    data_key: 'name_staking_1',
    tokenContractInfo: tokenLpContract,
    stakeContractInfo: stakeLpContract,
    tokenStakeContractInfo: tokenStakingTorqContract,
  },
]
