import { arbitrumGoerli } from 'wagmi/dist/chains'

export const chain = arbitrumGoerli
export const chainRpcUrl = chain?.rpcUrls?.default?.http?.[0]
