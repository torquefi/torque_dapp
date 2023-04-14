import { createSlice } from '@reduxjs/toolkit'

export interface IBorrow {
  borrowTime: string
}

const initialState: IBorrow = {
  borrowTime: '',
}

export const BorrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    updateBorrowTime: (state: IBorrow, action: any): IBorrow => {
      return {
        ...state,
        borrowTime: action.payload,
      }
    },
  },
})

export const { updateBorrowTime } = BorrowSlice.actions

export default BorrowSlice.reducer
