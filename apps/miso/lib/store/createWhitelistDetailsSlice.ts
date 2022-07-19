import { StoreSlice, WhitelistEntry } from '../types'

export interface IWhitelistDetails {
  whitelistEnabled: boolean
  whitelistAddresses: WhitelistEntry[]
}

export const whitelistDetailsDefaultValues = {
  whitelistEnabled: false,
  whitelistAddresses: [],
}

interface ILiquidityDetailsSlice extends IWhitelistDetails {
  setWhitelistDetails: (_: IWhitelistDetails) => void
}

export const createWhitelistDetailsSlice: StoreSlice<ILiquidityDetailsSlice> = (set) => ({
  ...whitelistDetailsDefaultValues,
  setWhitelistDetails: (newState) => set(() => newState),
})
