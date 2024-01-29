import {
  boostBtcAbi,
  btcAbi,
  boostWethAbi,
  ethAbi,
  torqAbi,
  tusdAbi,
  gmxWethAbi,
} from './abi'
export interface IContractInfo {
  name?: string
  address: string
  abi: string
}

export const boostWbtcContract: IContractInfo = {
  address: '0xB3F4c9026f0786b4949fFb456CF9530696359B1e',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0x59E2AF9F3990E65736dA046bE34680CC7Ac9cC60',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0x09584A7f0e092cA59f68f1dEbAa78EDECb8865d9',
  abi: JSON.stringify(gmxWethAbi),
}

export const torqContract: IContractInfo = {
  address: '0xb56C29413AF8778977093B9B4947efEeA7136C36',
  abi: JSON.stringify(torqAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}

export const tusdContract: IContractInfo = {
  address: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
  abi: JSON.stringify(tusdAbi),
}
