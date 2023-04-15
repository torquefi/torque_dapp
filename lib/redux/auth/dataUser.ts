import { createSlice } from '@reduxjs/toolkit'

export interface IDataUser {
  borrowTime: string
}

const initialState: IDataUser = {
  borrowTime: '',
}

export const DataUserSlice = createSlice({
  name: 'dataUser',
  initialState,
  reducers: {
    updateborrowTime: (state: IDataUser, action: any): IDataUser => {
      return {
        ...state,
        borrowTime: action.payload,
      }
    },
  },
})

export const { updateborrowTime } = DataUserSlice.actions

export default DataUserSlice.reducer
