import {
  boostBtcAbi,
  btcAbi,
  boostEthAbi,
  ethAbi,
  // boostTorqAbi,
  torqAbi,
  // boostCompAbi,
  // compAbi,
  tusdAbi,
} from './abi'
export interface IContractInfo {
  name?: string
  address: string
  abi: string
}

export const boostBtcContract: IContractInfo = {
  address: '0xB3F4c9026f0786b4949fFb456CF9530696359B1e',
  abi: JSON.stringify(boostBtcAbi),
}

export const btcContract: IContractInfo = {
  address: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
  abi: JSON.stringify(btcAbi),
}

export const boostEtherContract: IContractInfo = {
  address: '0xB3F4c9026f0786b4949fFb456CF9530696359B1e',
  abi: JSON.stringify(boostEthAbi),
}

export const ethContract: IContractInfo = {
  address: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
  abi: JSON.stringify(ethAbi),
}

// export const boostTorqContract: IContractInfo = {
//   address: '0xB3F4c9026f0786b4949fFb456CF9530696359B1e',
//   abi: JSON.stringify(boostTorqAbi),
// }

export const torqContract: IContractInfo = {
  address: '0xb56C29413AF8778977093B9B4947efEeA7136C36',
  abi: JSON.stringify(torqAbi),
}

// export const boostCompContract: IContractInfo = {
//   address: '0xB3F4c9026f0786b4949fFb456CF9530696359B1e',
//   abi: JSON.stringify(boostCompAbi),
// }

// export const compContract: IContractInfo = {
//   address: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
//   abi: JSON.stringify(compAbi),
// }

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(torqAbi),
}

export const tusdContract: IContractInfo = {
  address: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
  abi: JSON.stringify(tusdAbi),
}
