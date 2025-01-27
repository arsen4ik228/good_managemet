import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projectSlice",
  initialState: {
    projectCreatedId: null,
    organizationProjectId: null,
  },

  reducers: {
    setProjectCreatedId(state, action) {
      state.projectCreatedId = action.payload;
    },
    setProjectOrganizationId(state, action) {
      state.organizationProjectId = action.payload;
    },
  },

});

export const {
  setProjectCreatedId,
  setProjectOrganizationId,
} = projectSlice.actions;

export default projectSlice.reducer;
