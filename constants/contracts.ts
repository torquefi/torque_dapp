import {
  boostBtc as boostBtcAbi,
  btc as btcAbi,
  boostEth as boostEthAbi,
  eth as ethAbi,
  // boostTorq as boostTorqAbi,
  // torq as torqAbi,
  // boostComp as boostCompAbi,
  // comp as compAbi,
} from './abi';
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

export const boostEthContract: IContractInfo = {
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

// export const torqContract: IContractInfo = {
//   address: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
//   abi: JSON.stringify(torqAbi),
// }

// export const boostCompContract: IContractInfo = {
//   address: '0xB3F4c9026f0786b4949fFb456CF9530696359B1e',
//   abi: JSON.stringify(boostCompAbi),
// }

// export const compContract: IContractInfo = {
//   address: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
//   abi: JSON.stringify(compAbi),
// }

// export const tusdContract: IContractInfo = {
//   address: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
//   abi: JSON.stringify(tokenTusdABI),
// }
