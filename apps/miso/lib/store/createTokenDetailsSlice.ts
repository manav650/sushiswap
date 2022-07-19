import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { useToken } from 'wagmi'

import { StoreSlice, TokenSetup, TokenType } from '../types'
import { useAuctionCreateStore } from '.'

export interface ITokenDetails {
  tokenType: TokenType
  tokenSetupType: TokenSetup
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  tokenSupply: number | null
  tokenAmount: number | null
}

export const tokenDetailsDefaultValues = {
  tokenType: TokenType.FIXED,
  tokenSetupType: TokenSetup.NOT_SET,
  tokenAddress: '',
  tokenAmount: null,
  tokenName: '',
  tokenSymbol: '',
  tokenSupply: null,
}

interface ITokenDetailsSlice extends ITokenDetails {
  setTokenDetails: (_: ITokenDetails) => void
}

export const createTokenDetailsSlice: StoreSlice<ITokenDetailsSlice> = (set) => ({
  ...tokenDetailsDefaultValues,
  setTokenDetails: (newState) => set(() => newState),
})

export const useAuctionedToken = () => {
  const { tokenSymbol, tokenName, tokenAddress, tokenSetupType } = useAuctionCreateStore(
    ({ tokenSymbol, tokenName, tokenAddress, tokenSetupType }) => ({
      tokenSymbol,
      tokenName,
      tokenAddress,
      tokenSetupType,
    })
  )

  const providedToken = useToken(tokenSetupType === TokenSetup.PROVIDE ? tokenAddress : undefined)
  // TODO chainId 1?
  const createdToken = useMemo(
    () =>
      new Token({
        chainId: ChainId.ETHEREUM,
        address: AddressZero,
        decimals: 18,
        symbol: tokenSymbol,
        name: tokenName,
      }),
    [tokenName, tokenSymbol]
  )
  return tokenSetupType === TokenSetup.PROVIDE ? providedToken : createdToken
}
