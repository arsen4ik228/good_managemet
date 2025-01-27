// // src/redux/authSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     token: localStorage.getItem('vkToken') || null,
//     isAuthenticated: !!localStorage.getItem('vkToken'),
//   },
//   reducers: {
//     login: (state, action) => {
//       state.token = action.payload;
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.token = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;
// authReducer.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoaded: false,
    isProcessing: false,
    isLoggedIn: false,
    userId: null,
  },
  reducers: {
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload !== undefined ? action.payload : null;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
    },
  },
});

export const { setLoaded, setProcessing, setLoggedIn, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
