import '@sushiswap/ui/index.css'

import type { AppProps } from 'next/app'
import React, { FC } from 'react'
import { allChains, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { useBalances } from './useBalances'

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
      <TokenUris />
    </WagmiConfig>
  )
}

function TokenUris() {
  const data = useBalances({
    enabled: true,
    chainId: 42161,
    account: '0x7a5f66Eb194F629dB12F25bd0695819CB690fcc7',
  })

  return <div>{JSON.stringify(data)}</div>
}

export default MyApp
