import {
  stakeLpAbi,
  stakeTorqAbi,
  tokenLpAbi,
  tokenStakeTORQAbi,
  tokenTorqAbi,
} from './abi'

export interface IContractInfo {
  address: string
  abi: string
}

export const tokenTorqContract: IContractInfo = {
  address: '0x7783c490B6D12E719A4271661D6Eb03539eB9BC9',
  abi: JSON.stringify(tokenTorqAbi),
}

export const tokenStakingTorqContract: IContractInfo = {
  address: '0x93797Bc71Ff7964A5d02cfC69FfEE04dFCb5fCAb',
  abi: JSON.stringify(tokenStakeTORQAbi),
}

export const stakeTorqContract: IContractInfo = {
  address: '0xaFd234ba78eb10F7c9C730470679fA07e37450B0',
  abi: JSON.stringify(stakeTorqAbi),
}

export const tokenLpContract: IContractInfo = {
  address: '0x88da624eD11CfAf1967B1D19B090636080Ece2f5',
  abi: JSON.stringify(tokenLpAbi),
}

export const stakeLpContract: IContractInfo = {
  address: '0x67e684caf3C0F899e4F0A3bd3C9C7b6F9ccd31a1',
  abi: JSON.stringify(stakeLpAbi),
}

export const tokenStakingLpContract: IContractInfo = {
  address: '0x4AC7f4Cf1a3913DBd407d0C3926Af41B87C3B593',
  abi: JSON.stringify(tokenStakeTORQAbi),
}
