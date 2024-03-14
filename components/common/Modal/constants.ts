import {
  wbtcContract,
  wethContract,
} from '@/components/pages/Boost/constants/contracts'
import { tokenUsdcContract } from '@/components/pages/Borrow/constants/contract'
import { torqContract, tusdContract } from '@/constants/contracts'

export const listSwapCoin = [
  {
    symbol: 'TUSD',
    tokenContractInfo: tusdContract,
  },
  {
    symbol: 'USDC',
    tokenContractInfo: tokenUsdcContract,
  },
  {
    symbol: 'WBTC',
    tokenContractInfo: wbtcContract,
  },
  {
    symbol: 'WETH',
    tokenContractInfo: wethContract,
  },
  {
    symbol: 'TORQ',
    tokenContractInfo: torqContract,
  },
]
