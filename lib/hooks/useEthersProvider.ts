import { providers } from 'ethers'
import { useMemo } from 'react'
import type { Transport, WalletClient } from 'viem'
import { useNetwork, useWalletClient } from 'wagmi'

export function clientToProvider(client: WalletClient | any = {}) {
  if (!client) {
    return undefined
  }
  const { chain, transport } = client
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  }
  if (!chain?.id) {
    return undefined
  }
  if (transport?.type === 'fallback') {
    return new providers.FallbackProvider(
      (transport?.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    )
  }
  return new providers.JsonRpcProvider(transport?.url, network)
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({
  chainId,
}: { chainId?: number | undefined } = {}) {
  const { chain } = useNetwork()
  const { data: client } = useWalletClient({ chainId: chainId || chain?.id })
  return useMemo(() => clientToProvider(client), [client])
}
