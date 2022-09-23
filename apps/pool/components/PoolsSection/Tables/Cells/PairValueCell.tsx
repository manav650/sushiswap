import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

// export const PairPositionCell: FC<CellProps> = ({ row }) => {
//   const ref = useRef<HTMLDivElement>(null)
//   const inViewport = useInViewport(ref)
//   return (
//     <div ref={ref}>
//       {inViewport && (
//         <PoolPositionProvider watch={false} pair={row.pair}>
//           <PoolPositionStakedProvider watch={false} pair={row.pair}>
//             <_PairPositionCell row={row} />
//           </PoolPositionStakedProvider>
//         </PoolPositionProvider>
//       )}
//     </div>
//   )
// }

interface PairValueCell {
  row: {
    valueUSD: number
  }
}

export const PairValueCell: FC<PairValueCell> = ({ row }) => {
  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {formatUSD(row.valueUSD)}
    </Typography>
  )
}
