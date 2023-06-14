import Web3 from 'web3'

export const requestSwitchNetwork = async (network: any): Promise<boolean> =>
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
                    name: network?.coinName,
                    decimals: 18,
                    symbol: network?.coinSymbol,
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
