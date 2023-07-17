import CurrencySwitchInit from '@/components/common/CurrencySwitch/Provider'
import store, { persistor } from '@/lib/redux/store'
import Moralis from 'moralis-v1'
import type { NextPage } from 'next'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import { MoralisProvider } from 'react-moralis'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Toaster } from 'sonner'
import SEO from '../next-seo.config'
import '../styles/style.scss'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { arbitrum, arbitrumGoerli } from 'wagmi/chains'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  pageProps?: any
}

const chains = [arbitrumGoerli, arbitrum]
const projectId = '02a231b2406ed316c861abefc95c5e59'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const serverUrl = 'https://moralis.torque.fi/server'
  const appId = '1'
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)
  if (typeof window !== 'undefined') {
    if (
      window.localStorage.getItem('theme') === 'dark' ||
      !('theme' in window.localStorage)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    Moralis.start({
      serverUrl: serverUrl,
      appId: appId, // server testnet
    })
    // Moralis.enableWeb3()
  }, [])

  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <DefaultSeo {...SEO} />
      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>
          <PersistGate persistor={persistor}>
            {() => (
              <div>
                <CurrencySwitchInit />
                {getLayout(<Component {...pageProps} />)}
              </div>
            )}
          </PersistGate>
        </WagmiConfig>
      </Provider>
      <Toaster theme="dark" richColors />
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </MoralisProvider>
  )
}
