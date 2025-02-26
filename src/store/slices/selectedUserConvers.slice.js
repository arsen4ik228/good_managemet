import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedItem: null, // Изначально выбранный элемент отсутствует
};

const selectedUserConverts = createSlice({
  name: 'selectedItem',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null; // Очищаем выбранный элемент
    },
  },
});

export const { setSelectedItem, clearSelectedItem } = selectedUserConverts.actions;
export default selectedUserConverts.reducer;