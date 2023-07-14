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
  address: '0xF2507889645C727A937Fa5909aFC3AFbD54D66d6',
  abi: JSON.stringify(tokenLpAbi),
}

export const stakeLpContract: IContractInfo = {
  address: '0x1804953BEb5b66A6e3FBe60a66777a40bffca229',
  abi: JSON.stringify(stakeLpAbi),
}

export const tokenStakingLpContract: IContractInfo = {
  address: '0x1804953BEb5b66A6e3FBe60a66777a40bffca229',
  abi: JSON.stringify(tokenStakeTORQAbi),
}
