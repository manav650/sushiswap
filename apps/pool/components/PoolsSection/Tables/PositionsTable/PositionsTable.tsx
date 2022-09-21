import { Pair, UserWithFarm } from '@sushiswap/graph-client/.graphclient'
import { useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
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

  const { data: userWithFarms, isValidating } = useSWR<UserWithFarm[]>(
    address
      ? `/pool/api/user/${address}${selectedNetworks ? `?networks=${JSON.stringify(selectedNetworks)}` : ''}`
      : null,
    (url) => fetch(url).then((response) => response.json())
  )

  const positions = useMemo(() => {
    if (!userWithFarms) return []
    return userWithFarms?.map((el) => el.pair)
  }, [userWithFarms])

  const table = useReactTable<Pair>({
    data: positions || [],
    state: {
      columnVisibility,
    },
    columns: COLUMNS as any,
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
    <GenericTable<Pair>
      table={table}
      HoverElement={isMd ? PositionQuickHoverTooltip : undefined}
      loading={!userWithFarms || isValidating}
      placeholder="No positions found"
      pageSize={Math.max(userWithFarms?.length || 0, 5)}
    />
  )
}
