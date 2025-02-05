import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    postCreatedId: null,
  },

  reducers: {
    setPostCreatedId(state, action) {
      state.postCreatedId = action.payload;
    },
  },

});

export const {
    setPostCreatedId,
} = postSlice.actions;

export default postSlice.reducer;