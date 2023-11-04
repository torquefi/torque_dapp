import {
  borrowBtcABI,
  borrowEthABI,
  compoundUsdc,
  usdcArb,
  ethABI,
  btcABI,
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

export const borrowEth: IContractInfo = {
  address: '0x4C164283a3a357BBEF0BA95eeF9CC0ED7fECA035',
  abi: JSON.stringify(borrowEthABI),
}

export const tokenEth: IContractInfo = {
  address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  abi: JSON.stringify(ethABI),
}

export const borrowBtc: IContractInfo = {
  address: '0x8D7fc7160073DEe5D1CcBE8Da2aE12A22Ec3a021',
  abi: JSON.stringify(borrowBtcABI),
}

export const tokenBtc: IContractInfo = {
  address: '0x22d5e2dE578677791f6c90e0110Ec629be9d5Fb5',
  abi: JSON.stringify(btcABI),
}
