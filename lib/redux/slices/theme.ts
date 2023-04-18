import { createSlice } from '@reduxjs/toolkit'

export interface IthemeType {
  theme: string
}

const initialState: IthemeType = {
  theme: '',
}

export const ThemeSlice = createSlice({
  name: 'usdPrice',
  initialState,
  reducers: {
    updateTheme: (state: IthemeType, action: any): IthemeType => {
      return {
        ...state,
        theme: action.payload,
      }
    },
  },
})

export const { updateTheme } = ThemeSlice.actions

export default ThemeSlice.reducer
