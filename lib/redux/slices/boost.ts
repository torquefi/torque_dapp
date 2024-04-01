import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IBoostInfo {
  createdWbtc: boolean
  createdWeth: boolean
}

const initialState: IBoostInfo = {
  createdWbtc: false,
  createdWeth: false,
}

export const BoostSlice = createSlice({
  name: 'boost',
  initialState,
  reducers: {
    updateCreatedWbtc: (state: IBoostInfo, action: any) => {
      return {
        ...state,
        createdWbtc: action.payload,
      }
    },
    updateCreatedWeth: (state: IBoostInfo, action: any) => {
      return {
        ...state,
        createdWeth: action.payload,
      }
    },
  },
})

export const { updateCreatedWbtc, updateCreatedWeth } = BoostSlice.actions

export default BoostSlice.reducer
