import '@sushiswap/ui/index.css'
import '../index.css'

import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAINS } from 'config'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { WagmiConfig } from 'wagmi'

import { Updaters as MulticallUpdaters } from '../lib/state/MulticallUpdaters'
import { Updaters as TokenListUpdaters } from '../lib/state/TokenListsUpdaters'
import store from '../store'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <WagmiConfig client={client}>
        <ReduxProvider store={store}>
          <ThemeProvider>
            <App.Shell>
              <Header />
              <MulticallUpdaters chainIds={SUPPORTED_CHAINS} />
              <TokenListUpdaters chainIds={SUPPORTED_CHAINS} />
              <Component {...pageProps} />
              <App.Footer />
            </App.Shell>
            <ToastContainer className="mt-[50px]" />
          </ThemeProvider>
        </ReduxProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
