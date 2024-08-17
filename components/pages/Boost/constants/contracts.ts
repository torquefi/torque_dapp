import { IContractInfo } from '@/constants/contracts'
import {
  boostBtcAbi,
  boostWethAbi,
  boostUniAbi,
  boostLinkAbi,
  boostCompAbi,
  boostTorqAbi,
  btcAbi,
  ethAbi,
  uniAbi,
  linkAbi,
  compAbi,
  torqAbi,
  gmxWbtcAbi,
  gmxWethAbi,
  gmxUniAbi,
  gmxLinkAbi,
  // gmxCompAbi,
  // gmxTorqAbi,
} from './abi'

export const boostWbtcContract: IContractInfo = {
  address: '0x1b4D6a73704242f9ECc310D883dBa11b764AADdB',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const gmxWbtcContract: IContractInfo = {
  address: '0xd6B39C27a778fCf3bD881dA9d4e5a60a75df1B94',
  abi: JSON.stringify(gmxWbtcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0xBb5A95db0A578773D9d8b99DebB7706e4124e2E2',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0x14aD948845f1a834273c0EE5a120e0107F9C2d99',
  abi: JSON.stringify(gmxWethAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}

export const boostUniContract: IContractInfo = {
  address: '0x22BacE1E1D034b08610Ec0A7c6Cbce592807F302',
  abi: JSON.stringify(boostUniAbi),
}

export const gmxUniContract: IContractInfo = {
  address: '0x566496AA56d61eB194A47328B60589DaEC1841C9',
  abi: JSON.stringify(gmxUniAbi),
}

export const uniContract: IContractInfo = {
  address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
  abi: JSON.stringify(uniAbi),
}

export const boostLinkContract: IContractInfo = {
  address: '0x6030A3E17377dBc2f9a15A1250FD8E1b0d49f2D3',
  abi: JSON.stringify(boostLinkAbi),
}

export const gmxLinkContract: IContractInfo = {
  address: '0x6735D25182E77257eC54e663BaF641E0D6449f62',
  abi: JSON.stringify(gmxLinkAbi),
}

export const linkContract: IContractInfo = {
  address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  abi: JSON.stringify(linkAbi),
}

export const boostCompContract: IContractInfo = {
  address: '0x0D08442B2758a50aA8187D602bA8261C333d44B2',
  abi: JSON.stringify(boostCompAbi),
}

// export const gmxCompContract: IContractInfo = {
//   address: '0x000000000000000000000000000000000000dEaD',
//   abi: JSON.stringify(gmxCompAbi),
// }

export const compContract: IContractInfo = {
  address: '0x354A6dA3fcde098F8389cad84b0182725c6C91dE',
  abi: JSON.stringify(compAbi),
}

export const boostTorqContract: IContractInfo = {
  address: '0xA6c53eC2a3085994000E5B831F5ECCCD051ea02c',
  abi: JSON.stringify(boostTorqAbi),
}

// export const gmxTorqContract: IContractInfo = {
//   address: '0x000000000000000000000000000000000000dEaD',
//   abi: JSON.stringify(gmxTorqAbi),
// }

export const torqContract: IContractInfo = {
  address: '0xb56C29413AF8778977093B9B4947efEeA7136C36',
  abi: JSON.stringify(torqAbi),
}
