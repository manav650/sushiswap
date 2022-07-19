import { createContext, FC, ReactNode, useContext } from 'react'

import { Auction } from './Auction'

interface AuctionContext {
  loading: boolean
  auction?: Auction
  children?: ReactNode
}

const Context = createContext<AuctionContext>({ loading: true, auction: undefined })

export const AuctionContext: FC<AuctionContext> = ({ children, auction, loading }) => {
  return <Context.Provider value={{ auction, loading }}>{children}</Context.Provider>
}

export const useAuctionContext = () => {
  return useContext(Context)
}
