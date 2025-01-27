import { createSlice } from "@reduxjs/toolkit";

const strategSlice = createSlice({
  name: "strateg",
  initialState: {
    selectedOrganizationId: null,
    selectedStrategyId: null,
  },

  reducers: {
    setSelectedOrganizationId(state, action) {
      state.selectedOrganizationId = action.payload;
    },
    setSelectedStrategyId(state, action) {
      state.selectedStrategyId = action.payload;
    },
  },

});

export const {
  setSelectedOrganizationId,
  setSelectedStrategyId,
} = strategSlice.actions;

export default strategSlice.reducer;