import { createSlice } from '@reduxjs/toolkit'

export interface ILayoutType {
  layoutBorrow: string
  layoutBoost: string
  visibilityBorrowBanner: boolean
  visibilityBoostBanner: boolean
}

const initialState: ILayoutType = {
  layoutBorrow: 'grid',
  layoutBoost: 'grid',
  visibilityBorrowBanner: false,
  visibilityBoostBanner: false,
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
    updateVisibilityBorrowBanner: (state: ILayoutType, action: any) => {
      return {
        ...state,
        visibilityBorrowBanner: action.payload,
      }
    },
    updateVisibilityBoostBanner: (state: ILayoutType, action: any) => {
      return {
        ...state,
        visibilityBoostBanner: action.payload,
      }
    },
  },
})

export const { updateLayoutBorrow, updateLayoutBoost, updateVisibilityBorrowBanner, updateVisibilityBoostBanner } = LayoutSlice.actions

export default LayoutSlice.reducer
