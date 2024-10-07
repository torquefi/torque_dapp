import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IBoostInfo {
  createdWbtc: boolean
  createdWeth: boolean
  createdLink: boolean
  createdUni: boolean
}

const initialState: IBoostInfo = {
  createdWbtc: false,
  createdWeth: false,
  createdLink: false,
  createdUni: false,
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
    updateCreatedLink: (state: IBoostInfo, action: any) => {
      return {
        ...state,
        createdLink: action.payload,
      }
    },
    updateCreatedUni: (state: IBoostInfo, action: any) => {
      return {
        ...state,
        createdUni: action.payload,
      }
    },
  },
})

export const {
  updateCreatedWbtc,
  updateCreatedWeth,
  updateCreatedLink,
  updateCreatedUni,
} = BoostSlice.actions

export default BoostSlice.reducer
