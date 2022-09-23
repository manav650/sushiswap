import { NetworkIcon } from '@sushiswap/ui'
import { FC } from 'react'

import { ICON_SIZE } from '../contants'

interface PairChainCell {
  row: {
    pair: {
      chainId: number
    }
  }
}

export const PairChainCell: FC<PairChainCell> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <NetworkIcon type="naked" chainId={row.pair.chainId} width={ICON_SIZE} height={ICON_SIZE} />
    </div>
  )
}
