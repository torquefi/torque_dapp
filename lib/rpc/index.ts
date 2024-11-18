import { useEffect, useState } from 'react'
import {
  AVALANCHE_FUJI,
  FALLBACK_PROVIDERS,
  getFallbackRpcUrl,
  getRpcUrl,
} from '@/configs/chains'
import { ethers } from 'ethers'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'

const avaxWsProvider = new ethers.providers.JsonRpcProvider(
  'https://api.avax.network/ext/bc/C/rpc'
)
avaxWsProvider.pollingInterval = 2000

const fujiWsProvider = new ethers.providers.JsonRpcProvider(
  getRpcUrl(AVALANCHE_FUJI)
)
fujiWsProvider.pollingInterval = 2000

export function getProvider(
  library: Web3Provider | undefined,
  chainId: number
) {
  let provider

  if (library) {
    return library.getSigner()
  }

  provider = getRpcUrl(chainId)

  return new ethers.providers.StaticJsonRpcProvider(
    provider,
    // @ts-ignore incorrect Network param types
    { chainId }
  )
}

export function getFallbackProvider(chainId: number) {
  if (!FALLBACK_PROVIDERS[chainId]) {
    return
  }

  const provider = getFallbackRpcUrl(chainId)

  return new ethers.providers.StaticJsonRpcProvider(
    provider,
    // @ts-ignore incorrect Network param types
    { chainId }
  )
}

export function useJsonRpcProvider(chainId: number) {
  const [provider, setProvider] = useState<JsonRpcProvider>()

  useEffect(() => {
    async function initializeProvider() {
      const rpcUrl = getRpcUrl(chainId)

      if (!rpcUrl) return

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

      await provider.ready

      setProvider(provider)
    }

    initializeProvider()
  }, [chainId])

  return { provider }
}
