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
  address: '0x279A237F074AC942AD3147834a3b8431b9a759dE',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const gmxWbtcContract: IContractInfo = {
  address: '0xf4A597B9879b091270A9F4c07022ee7857A56A70',
  abi: JSON.stringify(gmxWbtcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0x36Ac52C415042Fbc6D7564f4ad1410094f214f92',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0xd698D5F734E6be707B33f452A840BA56159A81aD',
  abi: JSON.stringify(gmxWethAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}

export const boostUniContract: IContractInfo = {
  address: '0x2D422D47dB58cEB32D28E880e87fF673bb086544',
  abi: JSON.stringify(boostUniAbi),
}

export const gmxUniContract: IContractInfo = {
  address: '0x82927257fAdB173AB78402D091c1080aA89fF6E4',
  abi: JSON.stringify(gmxUniAbi),
}

export const uniContract: IContractInfo = {
  address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
  abi: JSON.stringify(uniAbi),
}

export const boostLinkContract: IContractInfo = {
  address: '0x914DC0103E542FA3F823dbE3aaA67926d84B5178',
  abi: JSON.stringify(boostLinkAbi),
}

export const gmxLinkContract: IContractInfo = {
  address: '0xbBdd2226AE13dbcc821f1fecE1E8aaF1587a9c99',
  abi: JSON.stringify(gmxLinkAbi),
}

export const linkContract: IContractInfo = {
  address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  abi: JSON.stringify(linkAbi),
}
