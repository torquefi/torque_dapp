import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'

type TipsData = {
  id: number
  title: string
  state: string
  tip: string
  timeVote: string
  voteRed: number
  voteGreen: number
}

interface ITipsState {
  tipData: TipsData[]
}

const initialState: ITipsState = {
  tipData: [],
}

export const tipsSlice = createSlice({
  name: 'tip',
  initialState,
  reducers: {
    updateTipsData: (state, action: PayloadAction<TipsData[]>) => {
      state.tipData = action.payload
    },
  },
})

export const { updateTipsData } = tipsSlice.actions
export default tipsSlice.reducer
