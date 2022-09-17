import '@sushiswap/ui/index.css'

import { SUPPORTED_CHAIN_IDS } from 'config'
import type { AppProps } from 'next/app'
import React, { FC } from 'react'
import { allChains, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const alchemyId = 'KvKHCWsYw5iH9PxuMI0qdvCsiOLxv4zn'

const { provider, webSocketProvider } = configureChains(
  [...allChains],
  [alchemyProvider({ alchemyId }), publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      {/*<Provider store={store}>*/}
      {/*<ThemeProvider>*/}
      {/*  <App.Shell>*/}
      {/*<Header />*/}
      {/*<MulticallUpdaters chainIds={SUPPORTED_CHAIN_IDS} />*/}
      {/*<TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />*/}
      <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
      {/*<App.Footer />*/}
      {/*<ToastContainer className="mt-[50px]" />*/}
      {/*</App.Shell>*/}
      {/*</ThemeProvider>*/}
      {/*</Provider>*/}
    </WagmiConfig>
  )
}

export default MyApp
