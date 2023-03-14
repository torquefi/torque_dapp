import { createSlice } from '@reduxjs/toolkit'

export interface IUsdPrice {
  price: { [key: string]: number }
}

const initialState: IUsdPrice = {
  price: {},
}

export const UsdPriceSlice = createSlice({
  name: 'usdPrice',
  initialState,
  reducers: {
    updateAllUsdPrice: (state: IUsdPrice, action: any): IUsdPrice => {
      return {
        ...state,
        price: action.payload,
      }
    },
  },
})

export const { updateAllUsdPrice } = UsdPriceSlice.actions

export default UsdPriceSlice.reducer
