import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../baseUrl";
import { prepareHeaders } from "../Function/prepareHeaders.js";
import apiSlice from "../api.js";

export const controlPanelApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getControlPanelId: build.query({
      query: ({ controlPanelId }) => ({
        url: `controlPanels/${controlPanelId}/controlPanel`,
      }),

      transformResponse: (response) => {
        const statisticsIdsInPanel =
          response?.panelToStatistics?.map((item) => item.statistic.id) || [];
        const statisticsPoints =
          response?.panelToStatistics
            ?.map((item) => ({
              panelToStatisticsId: item.id,
              orderStatisticNumber: item.orderStatisticNumber,
              id: item.statistic.id,
              name: item.statistic.name,
              statisticDatas: item.statistic.statisticDatas,
            }))
            .sort((a, b) => a.orderStatisticNumber - b.orderStatisticNumber) ||
          [];
        return {
          response: response,
          statisticsIdsInPanel: statisticsIdsInPanel,
          statisticsPoints: statisticsPoints,
        };
      },
      providesTags: [{ type: "Panel", id: "LIST" }],
    }),

    getAllControlPanel: build.query({
      query: ({ organizationId }) => ({
        url: `controlPanels/${organizationId}`,
      }),
      providesTags: [{ type: "Panel", id: "LIST" }],
    }),

    postControlPanel: build.mutation({
      query: (body) => ({
        url: `controlPanels/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Panel", id: "LIST" }],
    }),

    deleteControlPanel: build.mutation({
      query: ({ controlPanelId }) => ({
        url: `controlPanels/${controlPanelId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Panel", id: "LIST" }],
    }),

    updateControlPanel: build.mutation({
      query: ({ id, ...body }) => ({
        url: `controlPanels/${id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Panel", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllControlPanelQuery,
  useGetControlPanelIdQuery,
  useDeleteControlPanelMutation,
  usePostControlPanelMutation,
  useUpdateControlPanelMutation,
} = controlPanelApi;
