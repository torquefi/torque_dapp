import {
  stakeLpContract,
  stakeTorqContract,
  tokenLpContract,
  tokenTorqContract,
} from '@/constants/contracts'
import { IStakingInfo } from './types'

export const STAKING_POOLS: IStakingInfo[] = [
  {
    label: 'TORQ',
    symbol: 'TORQ',
    threeYearValue: 0,
    rate: 1.72,
    APY: 24,
    tokenContract: tokenTorqContract,
    stakeContract: stakeTorqContract,
  },
  {
    label: 'LP',
    symbol: 'LP',
    threeYearValue: 0,
    rate: 2.68,
    APY: 56,
    tokenContract: tokenLpContract,
    stakeContract: stakeLpContract,
  },
]

export const STAKING_DATA: IStakingInfo[] = [
  {
    label: 'TORQ',
    symbol: 'TORQ',
    deposited: 0,
    earnings: 0,
    APY: 24,
    tokenContract: tokenTorqContract,
    stakeContract: stakeTorqContract,
  },
  {
    label: 'LP',
    symbol: 'LP',
    deposited: 0,
    earnings: 0,
    APY: 56,
    tokenContract: tokenLpContract,
    stakeContract: stakeLpContract,
  },
]