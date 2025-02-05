import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; // Исправленный импорт
import { prepareHeaders } from './Function/prepareHeaders';

const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders
  }),
  tagTypes: ['Panel', 'PanelToStatistics', 'User', 'File',   "Post", "PostNew", "Statistics"   ],
  endpoints: builder => ({}),
})

export default apiSlice;
