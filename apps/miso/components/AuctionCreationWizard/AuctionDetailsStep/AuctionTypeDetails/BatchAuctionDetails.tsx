import { AddressZero } from '@ethersproject/constants'
import { Form } from '@sushiswap/ui'
import React, { FC } from 'react'

export const BatchAuctionDetails: FC = () => {
  const { chainId } = useActiveWeb3React()
  const paymentCurrencyAddress = useStore((state) => state.paymentCurrencyAddress)
  const paymentToken =
    useToken(paymentCurrencyAddress !== AddressZero ? paymentCurrencyAddress : undefined) ?? NATIVE[chainId || 1]

  return (
    <div className="w-full md:w-1/2">
      <Form.TextField
        {...(paymentToken && {
          endIcon: (
            <Typography variant="sm" weight={700} className="text-secondary">
              {paymentToken.symbol}
            </Typography>
          ),
        })}
        name="minimumRaised"
        label={i18n._(t`Minimum raise amount*`)}
        placeholder="0.00"
        helperText={i18n._(t`Minimum amount to raise in order to have a successful auction`)}
      />
    </div>
  )
}
