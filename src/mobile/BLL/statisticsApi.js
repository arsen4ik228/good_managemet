import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, selectedOrganizationId } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  tagTypes: ["Statistics", "Statistics1"],
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
  endpoints: (build) => ({

    getStatistics: build.query({
      query: ({ statisticData = true }) => ({
        url: `statistics/${selectedOrganizationId}/?statisticData=${statisticData}`,
      }),
      transformResponse: (response) => {
        console.log('getStatistics:  ', response)

        if (!Array.isArray(response)) {
          console.error('Response is not an array');
          return [];
        }

        const transformData = response?.map(item => {
          return {
            id: item.id || '',
            name: item.name || '',
            ...(item.post && {
              post: {
                id: item?.post?.id || '',
                name: item.post?.postName || ''
              }
            }),
          }

        })

        console.log('Transform Data:  ', transformData)
        return transformData
      },
      providesTags: (result) => result ? [{ type: 'Statistics', id: "LIST" }] : [],
    }),

    postStatistics: build.mutation({
      query: ({ ...body }) => ({
        url: `/statistics/new`,
        method: "POST",
        type: "Прямая",
        name: "Статистика",
        statisticDataCreateDtos: [
          {
            value: 0,
            valueDate: new Date().toISOString().split('T')[0],
            isCorrelation: false
          },

        ],
        body,
      }),
      invalidatesTags: (result) => result ? [{ type: "Statistics", id: "LIST" }] : []
    }),


    getStatisticsId: build.query({
      query: ({ statisticId }) => ({
        url: `statistics/${statisticId}/statistic`,
      }),
      transformResponse: (response) => {
        console.log('getStatisticsId    ', response)
        return {
          currentStatistic: response || {},
          statisticDatas: response.statisticDatas || [],
        };
      },
      providesTags: (result, error, { statisticId }) => result ? [{ type: "Statistics1", id: statisticId }] : []
    }),

    updateStatistics: build.mutation({
      query: (body) => ({
        url: `statistics/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { statisticId }) => result ? [{ type: "Statistics1", id: statisticId }] : []
    }),


  }),
});

export const { usePostStatisticsMutation, useGetStatisticsNewQuery, useGetStatisticsIdQuery, useGetStatisticsQuery, useUpdateStatisticsMutation, useUpdateStatisticsToPostIdMutation } = statisticsApi;