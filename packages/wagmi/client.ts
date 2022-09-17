import { allChains, configureChains, createClient } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

export type Client = ReturnType<typeof createClient>

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.INFURA_ID || process.env.NEXT_PUBLIC_INFURA_ID

const { provider, webSocketProvider } = configureChains(
  [...allChains],
  [alchemyProvider({ alchemyId }), publicProvider()]
)

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})
