import { createSlice } from '@reduxjs/toolkit'

export interface IAuth {
  address: string
}

const initialState: IAuth = {
  address: '',
}

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAddress: (state: IAuth, action: any): IAuth => {
      return {
        ...state,
        address: action.payload,
      }
    },
  },
})

export const { updateAddress } = AuthSlice.actions

export default AuthSlice.reducer
