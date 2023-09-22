import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import Web3 from 'web3'

const web3 = new Web3(Web3.givenProvider)

export const getBalanceByContractToken = async (
  abi: any,
  contractAddress: any,
  userWalletAddress: any
) => {
  const contract = new web3.eth.Contract(JSON.parse(abi), contractAddress)
  const balance = await contract.methods.balanceOf(userWalletAddress).call()
  return web3.utils.fromWei(balance, 'ether')
}

export const MAX_UINT256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
