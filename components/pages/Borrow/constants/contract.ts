import { IContractInfo } from '@/constants/contracts'
import borrowBtcManage from './abi/borrowBtcManage.json'
import borrowEthManage from './abi/borrowEthManage.json'
import tokenBtcManage from './abi/tokenBtcManage.json'
import tokenEthManage from './abi/tokenEthManage.json'

export const borrowBtcManageContractInfo: IContractInfo = {
  address: '0x5aD19486305462c4c7E77a666cf801096b26dd16',
  abi: JSON.stringify(borrowBtcManage),
}

export const borrowEthManageContractInfo: IContractInfo = {
  address: '0xc39271ef9A62108195FBA1027e9f6374ea5b55A5',
  abi: JSON.stringify(borrowEthManage),
}

export const tokenBtcManageContractInfo: IContractInfo = {
  address: '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
  abi: JSON.stringify(tokenBtcManage),
}

export const tokenEthManageContractInfo: IContractInfo = {
  address: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
  abi: JSON.stringify(tokenEthManage),
}
