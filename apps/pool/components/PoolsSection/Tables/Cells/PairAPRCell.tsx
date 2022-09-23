import { formatPercent } from '@sushiswap/format'
import { Farm } from '@sushiswap/graph-client/.graphclient'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../../FarmRewardsAvailableTooltip'

interface PairAPRCell {
  row: {
    pair: {
      farm: Farm
      apr: number
    }
  }
}

export const PairAPRCell: FC<PairAPRCell> = ({ row }) => {
  return (
    <Typography variant="sm" weight={600} className="flex items-center justify-end gap-1 text-slate-50">
      {!!row.pair.farm && <FarmRewardsAvailableTooltip />}
      {formatPercent(row.pair.apr)}
    </Typography>
  )
}
