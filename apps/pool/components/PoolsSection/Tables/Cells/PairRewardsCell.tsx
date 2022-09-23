import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'
import { FC } from 'react'

import { ICON_SIZE } from '../contants'

interface PairRewardsCell {
  row: {
    pair: {
      chainId: number
    }
  }
}

export const PairRewardsCell: FC<PairRewardsCell> = ({ row }) => {
  return (
    <Currency.IconList iconHeight={ICON_SIZE} iconWidth={ICON_SIZE}>
      <Currency.Icon currency={SUSHI[row.pair.chainId]} />
    </Currency.IconList>
  )
}
