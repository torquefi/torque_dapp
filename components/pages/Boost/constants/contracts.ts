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
  address: '0x2f93710017B311ADd7D247003a2f4F7c4f5Ac193',
  abi: JSON.stringify(boostBtcAbi),
}

export const wbtcContract: IContractInfo = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  abi: JSON.stringify(btcAbi),
}

export const gmxWbtcContract: IContractInfo = {
  address: '0xd3cCB75fe5ae9Ce1EBCE1ceA4391c8b9940035Fb',
  abi: JSON.stringify(gmxWbtcAbi),
}

export const boostWethContract: IContractInfo = {
  address: '0x23ca7Ae7ee8356b5d8443C65d5D758643A3F7120',
  abi: JSON.stringify(boostWethAbi),
}

export const gmxWethContract: IContractInfo = {
  address: '0x76305dF6B30DbbA589Cf7DfE9b65208bD5e4e6D1',
  abi: JSON.stringify(gmxWethAbi),
}

export const wethContract: IContractInfo = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  abi: JSON.stringify(ethAbi),
}
