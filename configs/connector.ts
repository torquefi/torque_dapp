import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'

export const WalletConnect = new WalletConnectConnector({
  rpc: { 1: 'https://mainnet.infura.io/v3/60ab76e16df54c808e50a79975b4779f' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})
