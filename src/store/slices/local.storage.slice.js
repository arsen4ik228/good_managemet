import { createSlice } from '@reduxjs/toolkit';

const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: {
    reduxSelectedOrganizationId: localStorage.getItem('selectedOrganizationId') || null,
    reduxSelectedOrganizationReportDay: localStorage.getItem('reportDay') || null,
    reduxUserId: localStorage.getItem('userId') || null,
    reduxSelectedOrganizationName: localStorage.getItem('name') || null,
  },
  reducers: {
    setSelectedOrganizationId: (state, action) => {
      state.reduxSelectedOrganizationId = action.payload;
    },
    setSelectedOrganizationReportDay: (state, action) => {
      state.reduxSelectedOrganizationReportDay = action.payload;
    },
    setUserId: (state, action) => {
      state.reduxUserId = action.payload
    },
    setSelectedOrganizationName: (state, action) => {
      state.reduxSelectedOrganizationName = action.payload
    },
  },
});

export const {setSelectedOrganizationId, setSelectedOrganizationReportDay, setUserId, setSelectedOrganizationName } = localStorageSlice.actions;
export default localStorageSlice.reducer;
