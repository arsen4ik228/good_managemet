import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from './Function/prepareHeaders';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders
  }),
  tagTypes: ['ControlPanel', 'PanelToStatistics', 'User', 'File',   "Post", "PostNew", "Statistics",     ],
  endpoints: builder => ({}),
})

export default apiSlice;
