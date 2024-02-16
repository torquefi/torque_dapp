import { arbitrumGoerli } from 'wagmi/dist/chains'

export const chain = arbitrumGoerli
export const chainRpcUrl = chain?.rpcUrls?.default?.http?.[0]

export const BSС_MAINNET = 56;
export const BSС_TESTNET = 97;
export const ETH_MAINNET = 1;
export const AVALANCHE = 43114;
export const AVALANCHE_FUJI = 43113;
export const ARBITRUM = 42161;
export const ARBITRUM_GOERLI = 421613;
export const FEES_HIGH_BPS = 50;
export const DEFAULT_ALLOWED_SLIPPAGE_BPS = 30;
