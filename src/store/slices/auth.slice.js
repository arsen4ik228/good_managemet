import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isRefreshing: false, // Флаг, указывающий, что токен обновляется
  },
  reducers: {
    startRefreshing: (state) => {
      state.isRefreshing = true;
    },
    stopRefreshing: (state) => {
      state.isRefreshing = false;
    },
  },
});

export const { startRefreshing, stopRefreshing } = authSlice.actions;
export default authSlice.reducer;