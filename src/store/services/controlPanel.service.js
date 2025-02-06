import apiSlice from "./api";

export const controlPanelApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllControlPanel: build.query({
      query: ({ organizationId }) => ({
        url: `controlPanels/${organizationId}`,
      }),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result?.map(({ id }) => ({
                type: 'ControlPanel',
                id,
              })),
              'ControlPanel',
            ]
          : ['ControlPanel'],
    }),

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
      providesTags: (result, err, arg) => [{ type: 'ControlPanel', id: arg.controlPanelId }],
    }),

    postControlPanel: build.mutation({
      query: (body) => ({
        url: `controlPanels/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ControlPanel"],
    }),

    deleteControlPanel: build.mutation({
      query: ({ controlPanelId }) => ({
        url: `controlPanels/${controlPanelId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: ["ControlPanel"],
    }),

    updateControlPanel: build.mutation({
      query: ({ id, ...body }) => ({
        url: `controlPanels/${id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'ControlPanel', id: arg.id }],
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
