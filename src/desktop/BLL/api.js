import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { prepareHeaders } from './Function/prepareHeaders'

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders
  }),
  tagTypes: ['Panel', 'Strategy', 'Directories', 'Goal', 'Objective', 'Organization', 'Policy', '', '', '', '', '',],
  endpoints: builder => ({}),
})

export default apiSlice