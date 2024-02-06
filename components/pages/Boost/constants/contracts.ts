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
  address: '0x1E980C592dd56B4E87975DD1BA7b04A4C20B02c5',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const gmxWbtcContract: IContractInfo = {
  address: '0xb0C3d26D36e6D1B7fCf09159DD962489EB83cb6e',
  abi: JSON.stringify(gmxWbtcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0xDE80Cc9724FfAD03C2626379f22718527bB74b68',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0x7A62C9192Ef422a2B365164bbF874e2D30F78300',
  abi: JSON.stringify(gmxWethAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}
