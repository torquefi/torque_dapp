import { createSlice } from '@reduxjs/toolkit'

export interface ILayoutType {
  layoutBorrow: string
  layoutBoost: string
}

const initialState: ILayoutType = {
  layoutBorrow: 'grid',
  layoutBoost: 'grid',
}

export const LayoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    updateLayoutBorrow: (state: ILayoutType, action: any) => {
      return {
        ...state,
        layoutBorrow: action.payload,
      }
    },
    updateLayoutBoost: (state: ILayoutType, action: any) => {
      return {
        ...state,
        layoutBoost: action.payload,
      }
    },
  },
})

export const { updateLayoutBorrow, updateLayoutBoost } = LayoutSlice.actions

export default LayoutSlice.reducer
