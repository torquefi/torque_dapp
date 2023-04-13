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
  address: '0x918a19768447cF20b206ADD0919Bb408aB31A043',
  abi: JSON.stringify(stakeTorqAbi),
}

export const stakeLpContract: IContractInfo = {
  address: '0x78cfB34BcE04c114A6C3F0996057A846dFDB311c',
  abi: JSON.stringify(stakeLpAbi),
}
