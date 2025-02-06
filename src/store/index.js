import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

//? Reducers
import localStorageReducer from './slices/local.storage.slice'
import postReducer from './slices/post.slice'
import programReducer from './slices/program.slice'
import projectReducer from './slices/project.slice'
import userReducer from './slices/user.slice'
import apiSlice from './services/api'

//? Actions
export * from './slices/local.storage.slice'
export * from './slices/post.slice'
export * from './slices/program.slice'
export * from './slices/project.slice'
export * from './slices/user.slice'

export const store = configureStore({
  reducer: {
    localStorage: localStorageReducer,
    post: postReducer,
    program: programReducer,
    project: projectReducer,
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
})

setupListeners(store.dispatch)