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
  address: '0x88da624eD11CfAf1967B1D19B090636080Ece2f5',
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
