import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import Web3 from 'web3'

const web3 = new Web3(Web3.givenProvider)

export const getBalanceByContractToken = async (
  abi: any,
  contractAddress: any,
  userWalletAddress: any
) => {
  try {
    const contract = new web3.eth.Contract(JSON.parse(abi), contractAddress)
    const decimal = await contract.methods.decimals().call()
    const balance = await contract.methods.balanceOf(userWalletAddress).call()
    return ethers.utils.formatUnits(balance, decimal).toString()
  } catch (error) {
    console.log('error :>> ', error)
    return 0
  }
}

export const MAX_UINT256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export const useContract = (abi: any, contractAddress: any) => {
  let provider = `https://arbitrum.llamarpc.com`
  const web3 = new Web3(provider)
  let contract = new web3.eth.Contract(abi, contractAddress)
  return contract
}
