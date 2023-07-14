import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'

export const WalletConnect = new WalletConnectConnector({
  rpc: { 1: 'https://ethereum.publicnode.com/' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})

export const Injected = new InjectedConnector({
  // supportedChainIds: [1, 3, 4, 5, 42, 421613],
  // supportedChainIds: [421613],
})
