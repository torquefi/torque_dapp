import { stakeLpAbi, stakeTorqAbi, tokenLpAbi, tokenTorqAbi } from './abi'

export interface IContractInfo {
  address: string
  abi: string
}

export const tokenTorqContract: IContractInfo = {
  address: '0xB98EfE47A7Ed24CBAF02318BCe8e6413A2d11a49',
  abi: JSON.stringify(tokenTorqAbi),
}

export const tokenLpContract: IContractInfo = {
  address: '0x221ec2bab33c18e2fead382fefff6f1949494c52',
  abi: JSON.stringify(tokenLpAbi),
}

export const stakeTorqContract: IContractInfo = {
  address: '0xE757159Ecc5B51DfDb696c99eF4436962D05d68C',
  abi: JSON.stringify(stakeTorqAbi),
}

export const stakeLpContract: IContractInfo = {
  address: '0x24137780670faA6772EC8f4Ec7B128500407Fa1e',
  abi: JSON.stringify(stakeLpAbi),
}
