import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IBorrowInfo {
  depositTokenSymbol: string
  liquidity?: number
  loanToValue?: number
  borrowRate?: number
}

export interface IBorrowStore {
  borrowTime: string
  borrowInfoByDepositSymbol: Record<string, IBorrowInfo>
}

const initialState: IBorrowStore = {
  borrowTime: '',
  borrowInfoByDepositSymbol: {},
}

export const BorrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    updateborrowTime: (state: IBorrowStore, action: any): IBorrowStore => {
      return {
        ...state,
        borrowTime: action.payload,
      }
    },
    updateBorrowInfo: (
      state: IBorrowStore,
      action: PayloadAction<IBorrowInfo>
    ): IBorrowStore => {
      return {
        ...state,
        borrowInfoByDepositSymbol: {
          ...state.borrowInfoByDepositSymbol,
          [action?.payload?.depositTokenSymbol]: {
            ...state.borrowInfoByDepositSymbol?.[
              action?.payload?.depositTokenSymbol
            ],
            ...action?.payload,
          },
        },
      }
    },
  },
})

export const { updateborrowTime, updateBorrowInfo } = BorrowSlice.actions

export default BorrowSlice.reducer
