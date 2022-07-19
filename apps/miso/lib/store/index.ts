import create, { StoreApi } from 'zustand'

import { createAuctionDetailsSlice } from './createAuctionDetailsSlice'
import { createGeneralDetails } from './createGeneralDetailsSlice'
import { createLiquidityDetailsSlice } from './createLiquidityDetailsSlice'
import { createTokenDetailsSlice } from './createTokenDetailsSlice'
import { createWhitelistDetailsSlice } from './createWhitelistDetailsSlice'

const createRootSlice = (set: StoreApi<any>['setState'], get: StoreApi<any>['getState']) => ({
  ...createTokenDetailsSlice(set, get),
  ...createGeneralDetails(set, get),
  ...createAuctionDetailsSlice(set, get),
  ...createLiquidityDetailsSlice(set, get),
  ...createWhitelistDetailsSlice(set, get),
})

export const useAuctionCreateStore = create(createRootSlice)
