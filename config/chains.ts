import { ethers } from 'ethers'
import { sample } from 'lodash'
// import { NetworkMetadata } from '@/lib/wallets'
// import { isDevelopment } from './env'

export type NetworkMetadata = {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

const { parseEther } = ethers.utils

export const MAINNET = 56
export const TESTNET = 97
export const ETH_MAINNET = 1
export const AVALANCHE = 43114
export const AVALANCHE_FUJI = 43113
export const ARBITRUM = 42161
export const ARBITRUM_GOERLI = 421613
export const FEES_HIGH_BPS = 50

// TODO take it from web3
export const DEFAULT_CHAIN_ID = ARBITRUM
export const CHAIN_ID = DEFAULT_CHAIN_ID

export const SUPPORTED_CHAIN_IDS = [ARBITRUM, AVALANCHE]

// if (isDevelopment()) {
//   SUPPORTED_CHAIN_IDS.push(AVALANCHE_FUJI, ARBITRUM_GOERLI)
// }

export const IS_NETWORK_DISABLED = {
  [ARBITRUM]: false,
  [AVALANCHE]: false,
}

export const CHAIN_NAMES_MAP: any = {
  [MAINNET]: 'BSC',
  [TESTNET]: 'BSC Testnet',
  [ARBITRUM_GOERLI]: 'Arbitrum Goerli',
  [ARBITRUM]: 'Arbitrum',
  [AVALANCHE]: 'Avalanche',
  [AVALANCHE_FUJI]: 'Avalanche Fuji',
}

export const GAS_PRICE_ADJUSTMENT_MAP: any = {
  [ARBITRUM]: '0',
  [AVALANCHE]: '3000000000', // 3 gwei
}

export const MAX_GAS_PRICE_MAP: any = {
  [AVALANCHE]: '200000000000', // 200 gwei
}

export const HIGH_EXECUTION_FEES_MAP: any = {
  [ARBITRUM]: 3, // 3 USD
  [AVALANCHE]: 3, // 3 USD
  [AVALANCHE_FUJI]: 3, // 3 USD
}

export const EXECUTION_FEE_MULTIPLIER_MAP: any = {
  // if gas prices on Arbitrum are high, the main transaction costs would come from the L2 gas usage
  // for executing positions this is around 65,000 gas
  // if gas prices on Ethereum are high, than the gas usage might be higher, this calculation doesn't deal with that
  // case yet
  [ARBITRUM]: 65000,
  // multiplier for Avalanche is just the average gas usage
  [AVALANCHE]: 700000,
  [AVALANCHE_FUJI]: 700000,
}

const constants: any = {
  [MAINNET]: {
    nativeTokenSymbol: 'BNB',
    defaultCollateralSymbol: 'BUSD',
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 8,
    v2: false,
  },

  [TESTNET]: {
    nativeTokenSymbol: 'BNB',
    defaultCollateralSymbol: 'BUSD',
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 8,
    v2: false,
  },

  [ARBITRUM_GOERLI]: {
    nativeTokenSymbol: 'ETH',
    wrappedTokenSymbol: 'WETH',
    defaultCollateralSymbol: 'USDC',
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther('0.0003'),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.0003'),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.000300001'),
  },

  [ARBITRUM]: {
    nativeTokenSymbol: 'ETH',
    wrappedTokenSymbol: 'WETH',
    defaultCollateralSymbol: 'USDC.e',
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther('0.0003'),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.0003'),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.000300001'),
  },

  [AVALANCHE]: {
    nativeTokenSymbol: 'AVAX',
    wrappedTokenSymbol: 'WAVAX',
    defaultCollateralSymbol: 'USDC',
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther('0.01'),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.01'),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.0100001'),
  },

  [AVALANCHE_FUJI]: {
    nativeTokenSymbol: 'AVAX',
    wrappedTokenSymbol: 'WAVAX',
    defaultCollateralSymbol: 'USDC',
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther('0.01'),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.01'),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.0100001'),
  },
}

const ALCHEMY_WHITELISTED_DOMAINS = ['gmx.io', 'app.gmx.io']

export const RPC_PROVIDERS: any = {
  [ETH_MAINNET]: ['https://rpc.ankr.com/eth'],
  [MAINNET]: [
    'https://bsc-dataseed.binance.org',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed3.defibit.io',
    'https://bsc-dataseed4.defibit.io',
    'https://bsc-dataseed2.ninicoin.io',
    'https://bsc-dataseed3.ninicoin.io',
    'https://bsc-dataseed4.ninicoin.io',
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.binance.org',
  ],
  [TESTNET]: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  [ARBITRUM]: [getDefaultArbitrumRpcUrl()],
  [ARBITRUM_GOERLI]: [
    'https://goerli-rollup.arbitrum.io/rpc',
    // "https://arb-goerli.g.alchemy.com/v2/cZfd99JyN42V9Clbs_gOvA3GSBZH1-1j",
    // "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
    // "https://arbitrum-goerli.public.blastapi.io",
  ],
  [AVALANCHE]: ['https://api.avax.network/ext/bc/C/rpc'],
  [AVALANCHE_FUJI]: ['https://rpc.ankr.com/avalanche_fuji'],
}

export const FALLBACK_PROVIDERS: any = {
  [ARBITRUM]: [getAlchemyHttpUrl()],
  [AVALANCHE]: [
    'https://avax-mainnet.gateway.pokt.network/v1/lb/626f37766c499d003aada23b',
  ],
  [AVALANCHE_FUJI]: [
    'https://endpoints.omniatech.io/v1/avax/fuji/public',
    'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc',
    'https://api.avax-test.network/ext/bc/C/rpc',
  ],
  [ARBITRUM_GOERLI]: [
    'https://arb-goerli.g.alchemy.com/v2/cZfd99JyN42V9Clbs_gOvA3GSBZH1-1j',
  ],
}

export const NETWORK_METADATA: { [chainId: number]: NetworkMetadata } = {
  [MAINNET]: {
    chainId: '0x' + MAINNET.toString(16),
    chainName: 'BSC',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[MAINNET],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [TESTNET]: {
    chainId: '0x' + TESTNET.toString(16),
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[TESTNET],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
  [ARBITRUM_GOERLI]: {
    chainId: '0x' + ARBITRUM_GOERLI.toString(16),
    chainName: 'Arbitrum Goerli Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[ARBITRUM_GOERLI],
    blockExplorerUrls: ['https://goerli.arbiscan.io/'],
  },
  [ARBITRUM]: {
    chainId: '0x' + ARBITRUM.toString(16),
    chainName: 'Arbitrum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[ARBITRUM],
    blockExplorerUrls: [getExplorerUrl(ARBITRUM)],
  },
  [AVALANCHE]: {
    chainId: '0x' + AVALANCHE.toString(16),
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[AVALANCHE],
    blockExplorerUrls: [getExplorerUrl(AVALANCHE)],
  },
  [AVALANCHE_FUJI]: {
    chainId: '0x' + AVALANCHE_FUJI.toString(16),
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[AVALANCHE_FUJI],
    blockExplorerUrls: [getExplorerUrl(AVALANCHE_FUJI)],
  },
}

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`)
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`)
  }

  return constants[chainId][key]
}

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId]
}

export function getDefaultArbitrumRpcUrl() {
  return 'https://arb1.arbitrum.io/rpc'
}

export function getRpcUrl(chainId: number): string | undefined {
  return sample(RPC_PROVIDERS[chainId])
}

export function getFallbackRpcUrl(chainId: number): string | undefined {
  return sample(FALLBACK_PROVIDERS[chainId])
}

export function getAlchemyHttpUrl() {
  if (
    typeof window !== 'undefined' &&
    ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)
  ) {
    return 'https://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ'
  }
  return 'https://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2'
}

export function getAlchemyWsUrl() {
  if (
    typeof window !== 'undefined' &&
    ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)
  ) {
    return 'wss://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ'
  }
  return 'wss://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2'
}

export function getExplorerUrl(chainId: number) {
  if (chainId === 3) {
    return 'https://ropsten.etherscan.io/'
  } else if (chainId === 42) {
    return 'https://kovan.etherscan.io/'
  } else if (chainId === MAINNET) {
    return 'https://bscscan.com/'
  } else if (chainId === TESTNET) {
    return 'https://testnet.bscscan.com/'
  } else if (chainId === ARBITRUM_GOERLI) {
    return 'https://goerli.arbiscan.io/'
  } else if (chainId === ARBITRUM) {
    return 'https://arbiscan.io/'
  } else if (chainId === AVALANCHE) {
    return 'https://snowtrace.io/'
  } else if (chainId === AVALANCHE_FUJI) {
    return 'https://testnet.snowtrace.io/'
  }
  return 'https://etherscan.io/'
}

export function getHighExecutionFee(chainId: number) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3
}

export function getExecutionFeeMultiplier(chainId: number) {
  return EXECUTION_FEE_MULTIPLIER_MAP[chainId] || 1
}

export function isSupportedChain(chainId: number) {
  return SUPPORTED_CHAIN_IDS.includes(chainId)
}
