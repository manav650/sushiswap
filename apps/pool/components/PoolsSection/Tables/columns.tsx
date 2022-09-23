import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { PairAPRCell } from './Cells/PairAPRCell'
import { PairChainCell } from './Cells/PairChainCell'
import { PairNameCell } from './Cells/PairNameCell'
import { PairRewardsCell } from './Cells/PairRewardsCell'
import { PairTVLCell } from './Cells/PairTVLCell'
import { PairValueCell } from './Cells/PairValueCell'
import { PairVolume24hCell } from './Cells/PairVolume24hCell'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Extract<T extends (...args: any) => any> = Parameters<T>[0]['row']

export const NETWORK_COLUMN: ColumnDef<Extract<typeof PairChainCell>, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PairChainCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const NAME_COLUMN: ColumnDef<Extract<typeof PairNameCell>, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PairNameCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
          <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />
        </div>
      </div>
    ),
  },
}

export const TVL_COLUMN: ColumnDef<Extract<typeof PairTVLCell>, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.pair.liquidityUSD,
  cell: (props) => <PairTVLCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const APR_COLUMN: ColumnDef<Extract<typeof PairAPRCell>, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: (row) => row.pair.apr,
  cell: (props) => <PairAPRCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const REWARDS_COLUMN: ColumnDef<Extract<typeof PairRewardsCell>, unknown> = {
  id: 'rewards',
  header: 'Rewards',
  cell: (props) => <PairRewardsCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center">
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
      </div>
    ),
  },
}

export const VALUE_COLUMN: ColumnDef<Extract<typeof PairValueCell>, unknown> = {
  id: 'valueUSD',
  header: 'Value',
  accessorFn: (row) => {
    console.log('accessed', row.valueUSD)
    return row.valueUSD
  },
  cell: (props) => <PairValueCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<Extract<typeof PairVolume24hCell>, unknown> = {
  id: 'volume',
  header: 'Volume (24h)',
  cell: (props) => <PairVolume24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
