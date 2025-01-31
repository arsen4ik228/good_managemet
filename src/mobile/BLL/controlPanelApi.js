import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js";

export const controlPanelApi = createApi({
  reducerPath: "controlPanelApi",
  tagTypes: ["Panel"],
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
  endpoints: (build) => ({
    getAllControlPanel: build.query({
      query: ({ organizationId }) => ({
        url: `controlPanels/${organizationId}`,
      }),
      providesTags: [{ type: "Panel", id: "LIST" }],
    }),

    getControlPanelId: build.query({
      query: ({ controlPanelId }) => ({
        url: `controlPanels/${controlPanelId}/controlPanel`,
      }),

      transformResponse: (response) => {
        const statisticsIdsInPanel = response?.panelToStatistics?.map(item => item.statistic.id) || [];
        const statisticsPoints = response?.panelToStatistics?.map(item => ({
          id: item.statistic.id,
          name: item.statistic.name,
          statisticDatas: item.statistic.statisticDatas
        })) || [];
        
        return { response: response, statisticsIdsInPanel: statisticsIdsInPanel, statisticsPoints:statisticsPoints };
      },
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
