import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./baseUrl";
import { prepareHeaders } from "./Function/prepareHeaders.js";

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  tagTypes: ["Statistics", "Statistics1"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getStatistics: build.query({
      query: ({ organizationId, statisticData = true }) => ({
        url: `/statistics/${organizationId}/?statisticData=${statisticData}`,
      }),
      transformResponse: (response) => {
        return response.sort((a, b) => a.name.localeCompare(b.name));
      },
      providesTags: (result) =>
        result ? [{ type: "Statistics", id: "LIST" }] : [],
    }),

    postStatistics: build.mutation({
      query: (body) => ({
        url: `statistics/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Statistics", id: "LIST" }] : [],
    }),

    getStatisticsId: build.query({
      query: ({ statisticId }) => ({
        url: `statistics/${statisticId}/statistic`,
      }),
      transformResponse: (response) => {
        return {
          currentStatistic: response || {},
          statisticDatas: response.statisticDatas || [],
        };
      },
      providesTags: (result, error, { statisticId }) =>
        result ? [{ type: "Statistics1", id: statisticId }] : [],
    }),

    updateStatistics: build.mutation({
      query: ({ statisticId, ...body }) => ({
        url: `/statistics/${statisticId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { statisticId }) =>
        result ? [{ type: "Statistics1", id: statisticId }] : [],
    }),

    updateStatisticsToPostId: build.mutation({
      query: ({ postId, ...body }) => ({
        url: `statistics/${postId}/updateBulk`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Statistics", id: "LIST" }] : [],
    }),
  }),
});

export const {
  usePostStatisticsMutation,
  useGetStatisticsIdQuery,
  useGetStatisticsQuery,
  useUpdateStatisticsMutation,
  useUpdateStatisticsToPostIdMutation,
} = statisticsApi;
