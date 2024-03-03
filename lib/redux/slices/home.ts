import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IHomeStore {
  totalSupply: string
  totalBorrow: string
  yourSupply: string
  yourBorrow: string
}

const initialState: IHomeStore = {
  totalSupply: '',
  totalBorrow: '',
  yourSupply: '',
  yourBorrow: '',
}

export const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    updateHomeInfo: (
      state: IHomeStore,
      action: PayloadAction<Partial<IHomeStore>>
    ): IHomeStore => {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})

export const { updateHomeInfo } = HomeSlice.actions

export default HomeSlice.reducer
