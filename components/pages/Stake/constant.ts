import {
  stakeLpContract,
  stakeTorqContract,
  tokenLpContract,
  tokenStakingLpContract,
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
    tokenContract: tokenTorqContract,
    stakeContract: stakeTorqContract,
    tokenStakeContract: tokenStakingTorqContract,
  },
  {
    label: 'LP',
    symbol: 'LP',
    threeYearValue: 0,
    rate: 2.68,
    APR: 56,
    tokenContract: tokenLpContract,
    stakeContract: stakeLpContract,
    tokenStakeContract: tokenStakingTorqContract,
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
    tokenContract: tokenTorqContract,
    stakeContract: stakeTorqContract,
    tokenStakeContract: tokenStakingTorqContract,
  },
  {
    label: 'LP',
    symbol: 'LP',
    deposited: 0,
    earnings: 0,
    APR: 56,
    data_key: 'name_staking_1',
    tokenContract: tokenLpContract,
    stakeContract: stakeLpContract,
    tokenStakeContract: tokenStakingTorqContract,
  },
]
