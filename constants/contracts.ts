import { torqAbi, tusdAbi, rewardAbi } from './abi'
export interface IContractInfo {
  name?: string
  address: string
  abi: string
}

export const tusdContract: IContractInfo = {
  address: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
  abi: JSON.stringify(tusdAbi),
}

export const torqContract: IContractInfo = {
  address: '0xb56C29413AF8778977093B9B4947efEeA7136C36',
  abi: JSON.stringify(torqAbi),
}

export const rewardsContract: IContractInfo = {
  address: '0x36A04745c615722f369b2Fd2B3F719f1a611F7cA',
  abi: JSON.stringify(rewardAbi),
}
