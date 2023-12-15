import {
  btcABI,
  ethABI,
  tokenTorqAbi,
  usgABI,
} from './abi'

export interface IContractInfo {
  name?: string
  address: string
  abi: string
}

export const tokenTorqContract: IContractInfo = {
  address: '0x7783c490B6D12E719A4271661D6Eb03539eB9BC9',
  abi: JSON.stringify(tokenTorqAbi),
}

export const tokenUSGContract: IContractInfo = {
  address: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
  abi: JSON.stringify(usgABI),
}

export const ethCoinContract: IContractInfo = {
  address: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
  abi: JSON.stringify(ethABI),
}

export const btcCoinContract: IContractInfo = {
  address: '0x25A4f6d1A02b31e5E1EB7ca37da31c911a9A8c69',
  abi: JSON.stringify(btcABI),
}

export const btc_ether_CoinContract: IContractInfo = {
  address: '0xbda18Ffa03Aab42F7004735F486c65e38A726481',
  abi: JSON.stringify(btcABI),
}
