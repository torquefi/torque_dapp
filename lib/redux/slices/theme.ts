import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeValue = 'light' | 'dark';

export interface IThemeType {
  theme: ThemeValue | '';
}

const initialState: IThemeType = {
  theme: '',
};

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<ThemeValue>): IThemeType => {
      return {
        ...state,
        theme: action.payload,
      };
    },
  },
});

export const { updateTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
