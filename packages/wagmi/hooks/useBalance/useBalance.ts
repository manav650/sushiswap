import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { JSBI, ZERO } from '@sushiswap/math'
import { useMemo } from 'react'
import { erc20ABI, useBalance as useWagmiBalance, useContractReads } from 'wagmi'

import { getBentoBoxContractConfig } from '../useBentoBoxContract'
import { BalanceMap } from './types'

type UseBalancesParams = {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ChainId
  enabled?: boolean
}

type UseBalances = (params: UseBalancesParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
  | Pick<ReturnType<typeof useWagmiBalance>, 'isError' | 'isLoading'>
) & {
  data: BalanceMap
}

export const useBalances: UseBalances = ({ enabled, chainId, account, currencies }) => {
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    error: isNativeError,
  } = useWagmiBalance({
    addressOrName: account,
    chainId,
    enabled,
    watch: true,
    keepPreviousData: true,
  })

  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      currencies.reduce<[Token[], string[][]]>(
        (acc, currencies) => {
          if (currencies && isAddress(currencies.wrapped.address)) {
            acc[0].push(currencies.wrapped)
            acc[1].push([currencies.wrapped.address])
          }

          return acc
        },
        [[], []]
      ),
    [currencies]
  )

  const contracts = useMemo(() => {
    const totals = validatedTokenAddresses.map((token) => ({
      chainId,
      ...getBentoBoxContractConfig(chainId),
      functionName: 'totals',
      args: token,
    }))

    const balanceInputs = validatedTokenAddresses.map((token, i) => ({
      chainId,
      ...getBentoBoxContractConfig(chainId),
      functionName: 'balanceOf',
      args: [validatedTokenAddresses[i][0], account],
    }))

    const walletBalanceInput = validatedTokenAddresses.map((token) => {
      return {
        chainId,
        addressOrName: token[0],
        contractInterface: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
      }
    })

    return [...totals, ...balanceInputs, ...walletBalanceInput]
  }, [validatedTokenAddresses, chainId, account])

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    enabled,
    watch: true,
    cacheOnBlock: true,
    keepPreviousData: true,
  })

  const tokens: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}

    if (data?.length !== contracts.length) return result
    for (let i = 0; i < validatedTokenAddresses.length; i++) {
      const { base, elastic } = data[i]
      if (base && elastic) {
        const rebase = { base: JSBI.BigInt(base.toString()), elastic: JSBI.BigInt(elastic.toString()) }
        const amount = Amount.fromShare(validatedTokens[i], data[i + validatedTokenAddresses.length].toString(), rebase)

        result[validatedTokens[i].address] = {
          [FundSource.BENTOBOX]: amount.greaterThan(ZERO) ? amount : Amount.fromRawAmount(validatedTokens[i], '0'),
          [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
        }
      } else {
        result[validatedTokens[i].address] = {
          [FundSource.BENTOBOX]: Amount.fromRawAmount(validatedTokens[i], '0'),
          [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
        }
      }

      const value = data[i + 2 * validatedTokenAddresses.length]
      const amount = value ? JSBI.BigInt(value.toString()) : undefined
      if (!result[validatedTokens[i].address]) {
        result[validatedTokens[i].address] = {
          [FundSource.BENTOBOX]: Amount.fromRawAmount(validatedTokens[i], '0'),
          [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
        }
      }

      if (amount)
        result[validatedTokens[i].address][FundSource.WALLET] = Amount.fromRawAmount(validatedTokens[i], amount)
      else result[validatedTokens[i].address][FundSource.WALLET] = Amount.fromRawAmount(validatedTokens[i], '0')
    }

    return result
  }, [contracts.length, data, validatedTokenAddresses.length, validatedTokens])

  return useMemo(() => {
    tokens[AddressZero] = {
      [FundSource.WALLET]:
        chainId && nativeBalance?.value
          ? Amount.fromRawAmount(Native.onChain(chainId), nativeBalance.value.toString())
          : undefined,
      [FundSource.BENTOBOX]:
        chainId && tokens[Native.onChain(chainId).wrapped.address]
          ? tokens[Native.onChain(chainId).wrapped.address][FundSource.BENTOBOX]
          : undefined,
    }

    return {
      data: tokens,
      isLoading: isLoading ?? isNativeLoading,
      isError: isError ?? isNativeError,
    }
  }, [tokens, chainId, nativeBalance?.value, isLoading, isNativeLoading, isError, isNativeError])
}

type UseBalanceParams = {
  account: string | undefined
  currency: Type | undefined
  chainId?: ChainId
  enabled?: boolean
}

type UseBalance = (params: UseBalanceParams) => Pick<ReturnType<typeof useBalances>, 'isError' | 'isLoading'> & {
  data: Record<FundSource, Amount<Type> | undefined> | undefined
}

export const useBalance: UseBalance = ({ chainId, account, currency, enabled = true }) => {
  const currencies = useMemo(() => [currency], [currency])
  const { data, isLoading, isError } = useBalances({ chainId, currencies, account, enabled })

  return useMemo(() => {
    const walletBalance = currency
      ? data[currency.isNative ? AddressZero : currency.wrapped.address]?.[FundSource.WALLET]
      : undefined
    const bentoBalance = currency
      ? data[currency.isNative ? AddressZero : currency.wrapped.address]?.[FundSource.BENTOBOX]
      : undefined

    return {
      isError: isError,
      isLoading: isLoading,
      data:
        currency && data
          ? {
              [FundSource.WALLET]: walletBalance,
              [FundSource.BENTOBOX]: bentoBalance,
            }
          : undefined,
    }
  }, [isError, isLoading, currency, data])
}
