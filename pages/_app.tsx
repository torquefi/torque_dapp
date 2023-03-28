import CurrencySwitchInit from '@/components/common/CurrencySwitch/Provider'
import store, { persistor } from '@/lib/redux/store'
import { Web3Provider } from '@ethersproject/providers'
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
import { createClient, configureChains, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { SessionProvider } from 'next-auth/react'
import { mainnet } from 'wagmi/chains'
import '../styles/style.scss'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  pageProps?: any
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const serverUrl = 'https://t18lcsfgwrdy.grandmoralis.com:2053/server'
  const appId = 'xxGYAnXLzPcsW42Ci9pmkuasJ2NJUyjt7uioTUij'
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  const { provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
  )

  const client = createClient({
    provider,
    webSocketProvider,
    autoConnect: true,
  })

  useEffect(() => {
    Moralis.start({
      serverUrl: serverUrl,
      appId: appId, // server testnet
    })
  }, [])

  return (
    <WagmiConfig client={client}>
      <MoralisProvider appId={appId} serverUrl={serverUrl}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <DefaultSeo {...SEO} />
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              {() => (
                <>
                  <CurrencySwitchInit />
                  {getLayout(<Component {...pageProps} />)}
                </>
              )}
            </PersistGate>
          </Provider>
          <Toaster theme="dark" />
        </SessionProvider>
      </MoralisProvider>
    </WagmiConfig>
  )
}
