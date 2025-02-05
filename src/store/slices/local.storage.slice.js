import { createSlice } from '@reduxjs/toolkit';

const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: {
    reduxSelectedOrganizationId: localStorage.getItem('selectedOrganizationId') || null,
    reduxSelectedOrganizationReportDay: localStorage.getItem('reportDay') || null,
  },
  reducers: {
    setSelectedOrganizationId: (state, action) => {
      state.reduxSelectedOrganizationId = action.payload;
    },
    setSelectedOrganizationReportDay: (state, action) => {
      state.reduxSelectedOrganizationReportDay = action.payload;
    },
  },
});

export const {setSelectedOrganizationId, setSelectedOrganizationReportDay } = localStorageSlice.actions;
export default localStorageSlice.reducer;
