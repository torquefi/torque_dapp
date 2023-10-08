import {
  borrowBTC_Eth_ABI,
  borrowETH_Arb_ABI,
  compoundUsdc,
  usdcArb,
} from './abi'
import { IContractInfo } from './contracts'

export const tokenUsdcContractInfo: IContractInfo = {
  address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  abi: JSON.stringify(usdcArb),
}

export const compoundUsdcContractInfo: IContractInfo = {
  address: '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf',
  abi: JSON.stringify(compoundUsdc),
}

export const borrowETH_Arb: IContractInfo = {
  address: '0xc39271ef9A62108195FBA1027e9f6374ea5b55A5',
  abi: JSON.stringify(borrowETH_Arb_ABI),
}

export const borrowBTC_Eth: IContractInfo = {
  address: '0x8D7fc7160073DEe5D1CcBE8Da2aE12A22Ec3a021',
  abi: JSON.stringify(borrowBTC_Eth_ABI),
}
