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

import { SettingsContextProvider } from '@/context/SettingsContext/SettingsContextProvider'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum } from 'wagmi/chains'
import { TokenPriceProvider } from '../components/providers/TokenPriceProvider'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  pageProps?: any
}

const chains = [arbitrum]
const projectId =
  process.env.REACT_APP_PROJECT_ID || '02a231b2406ed316c861abefc95c5e59'

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

  useEffect(() => {
    Moralis.start({
      serverUrl: serverUrl,
      appId: appId, // server testnet
    })
    // Moralis.enableWeb3()
  }, [])

  return (
    <Provider store={store}>
      <MoralisProvider appId={appId} serverUrl={serverUrl}>
        <DefaultSeo {...SEO} />
        <WagmiConfig config={wagmiConfig}>
          <PersistGate persistor={persistor}>
            {() => (
              <div>
                <TokenPriceProvider />
                <SettingsContextProvider>
                  {getLayout(<Component {...pageProps} />)}
                </SettingsContextProvider>
              </div>
            )}
          </PersistGate>
        </WagmiConfig>
        <Toaster theme="dark" richColors style={{ zIndex: 10000 }} />
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </MoralisProvider>
    </Provider>
  )
}
