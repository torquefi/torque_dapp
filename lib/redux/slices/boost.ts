import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IBoostInfo {
  createdWbtc: boolean
  createdWeth: boolean
  createdLink: boolean
  createdUni: boolean
  createdComp: boolean
  createdTorq: boolean
}

const initialState: IBoostInfo = {
  createdWbtc: false,
  createdWeth: false,
  createdLink: false,
  createdUni: false,
  createdComp: false,
  createdTorq: false,
}

export const BoostSlice = createSlice({
  name: 'boost',
  initialState,
  reducers: {
    updateCreatedWbtc: (state: IBoostInfo, action: PayloadAction<boolean>) => {
      return {
        ...state,
        createdWbtc: action.payload,
      }
    },
    updateCreatedWeth: (state: IBoostInfo, action: PayloadAction<boolean>) => {
      return {
        ...state,
        createdWeth: action.payload,
      }
    },
    updateCreatedLink: (state: IBoostInfo, action: PayloadAction<boolean>) => {
      return {
        ...state,
        createdLink: action.payload,
      }
    },
    updateCreatedUni: (state: IBoostInfo, action: PayloadAction<boolean>) => {
      return {
        ...state,
        createdUni: action.payload,
      }
    },
    updateCreatedComp: (state: IBoostInfo, action: PayloadAction<boolean>) => {
      return {
        ...state,
        createdComp: action.payload,
      }
    },
    updateCreatedTorq: (state: IBoostInfo, action: PayloadAction<boolean>) => {
      return {
        ...state,
        createdTorq: action.payload,
      }
    },
  },
})

export const {
  updateCreatedWbtc,
  updateCreatedWeth,
  updateCreatedLink,
  updateCreatedUni,
  updateCreatedComp,
  updateCreatedTorq,
} = BoostSlice.actions

export default BoostSlice.reducer
