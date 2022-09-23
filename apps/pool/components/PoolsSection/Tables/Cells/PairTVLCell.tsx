import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

interface PairTVLCell {
  row: {
    pair: {
      liquidityUSD: number
    }
  }
}

export const PairTVLCell: FC<PairTVLCell> = ({ row }) => {
  const tvl = formatUSD(row.pair.liquidityUSD)
  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {tvl.includes('NaN') ? '$0.00' : tvl}
    </Typography>
  )
}
