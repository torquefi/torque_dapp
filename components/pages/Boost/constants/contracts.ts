import { IContractInfo } from '@/constants/contracts'
import {
  boostBtcAbi,
  boostWethAbi,
  boostUniAbi,
  boostLinkAbi,
  btcAbi,
  ethAbi,
  uniAbi,
  linkAbi,
  gmxWbtcAbi,
  gmxWethAbi,
  gmxUniAbi,
  gmxLinkAbi,
} from './abi'

export const boostWbtcContract: IContractInfo = {
  address: '0xb0ca57F27374E51B2a2d7658440a3E762B13B59C',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const gmxWbtcContract: IContractInfo = {
  address: '0x7e59F7Fc232f3282A2Fe646cA671077CC9C2db3C',
  abi: JSON.stringify(gmxWbtcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0x87470f33458B37f4BaBf12FD55DD1Bb197113e47',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0xc6501fCbD04101E315679F5C4CEd81a8154e33d9',
  abi: JSON.stringify(gmxWethAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}

export const boostUniContract: IContractInfo = {
  address: '0x1024966Bb292491328C8807Fb98D307cCbBFa0E8',
  abi: JSON.stringify(boostUniAbi),
}

export const gmxUniContract: IContractInfo = {
  address: '0xF39A2C0c28f8bc1B0cb6154902B084bCcE4360E7',
  abi: JSON.stringify(gmxUniAbi),
}

export const uniContract: IContractInfo = {
  address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
  abi: JSON.stringify(uniAbi),
}

export const boostLinkContract: IContractInfo = {
  address: '0xb149266F2AdaF5f3b203997e9a4626e55667DAbB',
  abi: JSON.stringify(boostLinkAbi),
}

export const gmxLinkContract: IContractInfo = {
  address: '0xA837Fa02444bF9c4b32B9719B5078EAcbB0aE19B',
  abi: JSON.stringify(gmxLinkAbi),
}

export const linkContract: IContractInfo = {
  address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  abi: JSON.stringify(linkAbi),
}
