import { createSlice } from "@reduxjs/toolkit";

const programSlice = createSlice({
  name: "programSlice",
  initialState: {
    programCreatedId: null,
    organizationProgramId: null,
  },

  reducers: {
    setProgramCreatedId(state, action) {
      state.programCreatedId = action.payload;
    },
    setProgramOrganizationId(state, action) {
      state.organizationProgramId = action.payload;
    },
  },

});

export const {
    setProgramCreatedId,
    setProgramOrganizationId,
} = programSlice.actions;

export default programSlice.reducer;