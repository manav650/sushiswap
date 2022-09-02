import { chainShortName } from '@sushiswap/chain'
import { useBreakpoint } from '@sushiswap/ui'
import { useFarmRewards } from '@sushiswap/wagmi'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { Pair, User } from '../../../../.graphclient'
import { CHEF_TYPE_MAP } from '../../../../lib/constants'
import { PairWithBalance } from '../../../../types'
import { usePoolFilters } from '../../../PoolsProvider'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, POSITION_COLUMN, VOLUME_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'
import { PositionQuickHoverTooltip } from '../PositionQuickHoverTooltip'

// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, POSITION_COLUMN, VOLUME_COLUMN, APR_COLUMN]

export const PositionsTable: FC = () => {
  const { selectedNetworks } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const [columnVisibility, setColumnVisibility] = useState({})

  const {
    data: user,
    error,
    isValidating,
  } = useSWR<User>(
    `/pool/api/user/${address}${selectedNetworks ? `?networks=${JSON.stringify(selectedNetworks)}` : ''}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const { data: rewards } = useFarmRewards()
  const liquidityPositions: PairWithBalance[] = useMemo(() => {
    if (!user?.liquidityPositions) return []
    return user.liquidityPositions.map((el) => {
      const id = `${chainShortName[el.pair.chainId]}:${el.pair.id}`

      return {
        ...el.pair,
        id,
        incentives: rewards?.[el.pair.chainId]?.farms?.[id]?.incentives || [],
        liquidityTokenBalance: el.balance,
        farmId: rewards?.[el.pair.chainId]?.farms?.[id]?.id,
        chefType: rewards?.[el.pair.chainId]?.farms[id]?.chefType
          ? CHEF_TYPE_MAP[rewards?.[el.pair.chainId]?.farms[id]?.chefType]
          : undefined,
      }
    })
  }, [rewards, user?.liquidityPositions])

  const table = useReactTable<Pair | PairWithBalance>({
    data: liquidityPositions ?? [],
    state: {
      columnVisibility,
    },
    // @ts-ignore
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ volume: false, network: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ volume: false, network: false, apr: false, liquidityUSD: false })
    }
  }, [isMd, isSm])

  return (
    <GenericTable<Pair | PairWithBalance>
      table={table}
      // @ts-ignore
      columns={COLUMNS}
      HoverElement={isMd ? PositionQuickHoverTooltip : undefined}
      loading={isValidating && !error && !user}
      placeholder="No positions found"
    />
  )
}
