import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    createdUserId: null,
  },

  reducers: {
    setCreatedUserId(state, action) {
      state.createdUserId = action.payload;
    },
  },

});

export const {
    setCreatedUserId,
} = userSlice.actions;

export default userSlice.reducer;