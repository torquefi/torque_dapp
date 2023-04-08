import { stakeLpAbi, stakeTorqAbi, tokenLpAbi, tokenTorqAbi } from './abi'

export interface IContractInfo {
  address: string
  abi: string
}

export const tokenTorqContract: IContractInfo = {
  address: '0x4Aa7aed6BDa411534801D1d64227Bc1CFA79A1Dd',
  abi: JSON.stringify(tokenTorqAbi),
}

export const tokenLpContract: IContractInfo = {
  address: '0x221ec2bab33c18e2fead382fefff6f1949494c52',
  abi: JSON.stringify(tokenLpAbi),
}

export const stakeTorqContract: IContractInfo = {
  address: '0xB98E83dffb89e0CeD48331703729B2F9d833b993',
  abi: JSON.stringify(stakeTorqAbi),
}

export const stakeLpContract: IContractInfo = {
  address: '0xcc06ABe6c581111f3B8e58A039E0026BcD17CD9F',
  abi: JSON.stringify(stakeLpAbi),
}
