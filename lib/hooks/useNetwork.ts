import { networks } from '@/constants/networks'
import { useMemo } from 'react'
import { useMoralis } from 'react-moralis'
import Web3 from 'web3'

interface INetwork {
  name: string
  symbol: string
  chainId: number | string
  rpcUrls: string[]
  blockchainExplorer: string
  coinName: string
  [key: string]: any
}

interface IRequestNetwork {
  name: string
  symbol: string
  chainId: number | string
  rpcUrls: string[]
  blockchainExplorer: string
  coinName: string
  [key: string]: any
}
declare global {
  interface Window {
    ethereum?: any
  }
}
export default function useNetwork() {
  const { chainId } = useMoralis()

  const chainIdNumber = new Web3().utils.hexToNumber(chainId)

  const objNetworks: { [key: number]: INetwork } = useMemo(
    () => networks.reduce((acc, cur) => ({ ...acc, [cur?.chainId]: cur }), {}),
    [networks]
  )

  const requestSwitchNetwork = async (
    network: IRequestNetwork
  ): Promise<boolean> =>
    new Promise(async (resolve, reject) => {
      const web3 = new Web3(Web3.givenProvider)
      const chainId =
        typeof network?.chainId !== 'string'
          ? web3.utils.toHex(network?.chainId)
          : network?.chainId
      if (window.ethereum.networkVersion !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
          })
          return resolve(true)
        } catch (error) {
          // This error code indicates that the chain has not been added to MetaMask
          if (error.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: network?.name,
                    chainId: chainId,
                    nativeCurrency: {
                      name: network?.coinName || network?.symbol,
                      decimals: 18,
                      symbol: network?.symbol,
                    },
                    rpcUrls: network?.rpcUrls,
                  },
                ],
              })
              if (window.ethereum.networkVersion !== chainId) {
                return reject('User rejected the request switch chain')
              }
              return resolve(true)
            } catch (error) {
              return reject(error)
            }
          }
          return reject(error)
        }
      }
    })

  return {
    network: objNetworks[chainIdNumber],
    requestSwitchNetwork,
  }
}
