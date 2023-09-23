import { boostEthAbi, ethABI, usgABI } from './abi'

export interface IContractInfo {
  address: string
  abi: string
}

export const boostContract: IContractInfo = {
  address: '0xB3F4c9026f0786b4949fFb456CF9530696359B1e',
  abi: JSON.stringify(boostEthAbi),
}

export const ethContract: IContractInfo = {
  address: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
  abi: JSON.stringify(ethABI),
}

export const usgContract: IContractInfo = {
  address: '0xF9FE2f9C6167D3e64515C86b73b4A21637C6d67E',
  abi: JSON.stringify(usgABI),
}
