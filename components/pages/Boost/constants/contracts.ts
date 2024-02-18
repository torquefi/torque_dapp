import { IContractInfo } from '@/constants/contracts'
import {
  boostBtcAbi,
  boostWethAbi,
  btcAbi,
  ethAbi,
  gmxWbtcAbi,
  gmxWethAbi,
} from './abi'

export const boostWbtcContract: IContractInfo = {
  address: '0xc5C2a3AEAeB09285F7f7c62885129966AE639Bf5',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const gmxWbtcContract: IContractInfo = {
  address: '0x1af712943B1C6B9c1d912cd40c121a3Ebc6055D6',
  abi: JSON.stringify(gmxWbtcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0x261d07bE7ef781799472911BC8866052E833e121',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0xa0991eDF5964285509e9e36C798Dc44bF92842c8',
  abi: JSON.stringify(gmxWethAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}
