import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

interface PairVolume24hCell {
  row: {
    pair: {
      volume1d: number
    }
  }
}

export const PairVolume24hCell: FC<PairVolume24hCell> = ({ row }) => {
  const volume = formatUSD(row.pair.volume1d)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
