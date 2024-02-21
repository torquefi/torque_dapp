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
  address: '0x2021cd108D7a5c035642Df35a54C53b569d1E3f2',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const gmxWbtcContract: IContractInfo = {
  address: '0x01F5b9035cF10Be2Bfdfe3d0cF1c91aB0b4dABDe',
  abi: JSON.stringify(gmxWbtcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0x7543B77be6300Db8fbC295703CdF75eA2a66dbD2',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0x0aEb03415CF459b7BF3B4f12c67FB8791Ec97f6B',
  abi: JSON.stringify(gmxWethAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}
