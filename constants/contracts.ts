import {
  torqAbi,
  tusdAbi,
  rewardAbi,
  swapAbi,
  rewardTorqAbi,
  rewardArbAbi,
  tokenArbAbi,
} from './abi'
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

export const arbContract: IContractInfo = {
  address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
  abi: JSON.stringify(tokenArbAbi),
}

export const rewardsContract: IContractInfo = {
  address: '0x36A04745c615722f369b2Fd2B3F719f1a611F7cA',
  abi: JSON.stringify(rewardAbi),
}

export const rewardsTorqContract: IContractInfo = {
  address: '0x3452faA42fd613937dCd43E0f0cBf7d4205919c5',
  abi: JSON.stringify(rewardTorqAbi),
}

export const rewardsArbContract: IContractInfo = {
  address: '0x6965b496De9b7C0bF274F8f6D5Dfa359Ac7D3b72',
  abi: JSON.stringify(rewardArbAbi),
}

export const swapContract: IContractInfo = {
  address: '0xce0c0e633086e4bd3b2b4298d16b504490534411',
  abi: JSON.stringify(swapAbi),
}
